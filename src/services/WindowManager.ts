interface WindowOptions {
  title?: string;
  icon?: string | null;
}

interface WindowRecord {
  element: HTMLElement;
  zIndex: number;
  minimized: boolean;
  title: string;
  icon: string | null;
}

export interface WindowData {
  id: string;
  title: string;
  icon: string | null;
  minimized: boolean;
  active: boolean;
}

/**
 * WindowManager - Singleton service for managing window state
 *
 * Responsibilities:
 * - Track all open windows
 * - Manage z-index stacking
 * - Handle window focus
 * - Dispatch global window events
 */
class WindowManager extends EventTarget {
  private windows: Map<string, WindowRecord> = new Map();
  private activeWindowId: string | null = null;
  private zIndexCounter = 100;

  /**
   * Register a new window with the manager
   */
  register(windowElement: HTMLElement, options: WindowOptions = {}): string {
    const id = crypto.randomUUID();
    windowElement.dataset.windowId = id;

    this.windows.set(id, {
      element: windowElement,
      zIndex: this.zIndexCounter++,
      minimized: false,
      title: options.title || 'Window',
      icon: options.icon || null,
    });

    windowElement.style.zIndex = String(this.windows.get(id)!.zIndex);
    this.focus(id);

    this.dispatchEvent(
      new CustomEvent('window-registered', {
        detail: { id, title: options.title, icon: options.icon },
      }),
    );

    return id;
  }

  /**
   * Unregister a window from the manager
   */
  unregister(id: string): void {
    const windowData = this.windows.get(id);
    if (!windowData) return;

    this.windows.delete(id);

    if (this.activeWindowId === id) {
      this.activeWindowId = null;
      const nextWindow = Array.from(this.windows.entries())
        .filter(([_, data]) => !data.minimized)
        .sort((a, b) => b[1].zIndex - a[1].zIndex)[0];

      if (nextWindow) {
        this.focus(nextWindow[0]);
      }
    }

    this.dispatchEvent(
      new CustomEvent('window-unregistered', {
        detail: { id },
      }),
    );
  }

  /**
   * Focus a window (bring to front)
   */
  focus(id: string): void {
    if (this.activeWindowId === id) return;

    const windowData = this.windows.get(id);
    if (!windowData) return;

    if (this.activeWindowId) {
      const prevWindow = this.windows.get(this.activeWindowId);
      if (prevWindow) {
        prevWindow.element.setAttribute('inactive', '');
      }
    }

    this.zIndexCounter++;
    windowData.zIndex = this.zIndexCounter;
    windowData.element.style.zIndex = String(this.zIndexCounter);
    windowData.element.removeAttribute('inactive');

    this.activeWindowId = id;

    this.dispatchEvent(
      new CustomEvent('window-focused', {
        detail: { id, title: windowData.title },
      }),
    );
  }

  /**
   * Minimize a window
   */
  minimize(id: string): void {
    const windowData = this.windows.get(id);
    if (!windowData) return;

    windowData.minimized = true;
    windowData.element.style.display = 'none';

    if (this.activeWindowId === id) {
      this.activeWindowId = null;
      const nextWindow = Array.from(this.windows.entries())
        .filter(([_, data]) => !data.minimized)
        .sort((a, b) => b[1].zIndex - a[1].zIndex)[0];

      if (nextWindow) {
        this.focus(nextWindow[0]);
      }
    }

    this.dispatchEvent(
      new CustomEvent('window-minimized', {
        detail: { id, title: windowData.title },
      }),
    );
  }

  /**
   * Restore a minimized window
   */
  restore(id: string): void {
    const windowData = this.windows.get(id);
    if (!windowData) return;

    windowData.minimized = false;
    windowData.element.style.display = 'block';
    this.focus(id);

    this.dispatchEvent(
      new CustomEvent('window-restored', {
        detail: { id, title: windowData.title },
      }),
    );
  }

  /**
   * Get all windows
   */
  getAllWindows(): WindowData[] {
    return Array.from(this.windows.entries()).map(([id, data]) => ({
      id,
      title: data.title,
      icon: data.icon,
      minimized: data.minimized,
      active: id === this.activeWindowId,
    }));
  }

  /**
   * Get the count of all windows
   */
  getWindowCount(): number {
    return this.windows.size;
  }

  /**
   * Get a specific window by ID
   */
  getWindow(id: string): (WindowData & { element: HTMLElement }) | null {
    const data = this.windows.get(id);
    if (!data) return null;

    return {
      id,
      title: data.title,
      icon: data.icon,
      minimized: data.minimized,
      active: id === this.activeWindowId,
      element: data.element,
    };
  }

  /**
   * Update window metadata
   */
  updateWindow(id: string, updates: Partial<WindowOptions>): void {
    const windowData = this.windows.get(id);
    if (!windowData) return;

    if (updates.title !== undefined) {
      windowData.title = updates.title;
    }
    if (updates.icon !== undefined) {
      windowData.icon = updates.icon;
    }

    this.dispatchEvent(
      new CustomEvent('window-updated', {
        detail: { id, updates },
      }),
    );
  }
}

export const windowManager = new WindowManager();
