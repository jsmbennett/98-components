/**
 * WindowManager - Singleton service for managing window state
 *
 * Responsibilities:
 * - Track all open windows
 * - Manage z-index stacking
 * - Handle window focus
 * - Dispatch global window events
 *
 *  @class WindowManager
 */
class WindowManager extends EventTarget {
  constructor() {
    super();
    this.windows = new Map(); // Map<id, { element, zIndex, minimized, title, icon }>
    this.activeWindowId = null;
    this.zIndexCounter = 100;
  }

  /**
   * Register a new window with the manager
   * @param {HTMLElement} windowElement - The window element to register
   * @param {Object} options - Window metadata (title, icon, etc.)
   * @returns {string} The unique ID assigned to the window
   */
  register(windowElement, options = {}) {
    const id = crypto.randomUUID();
    windowElement.dataset.windowId = id;

    this.windows.set(id, {
      element: windowElement,
      zIndex: this.zIndexCounter++,
      minimized: false,
      title: options.title || "Window",
      icon: options.icon || null,
    });

    // Apply initial z-index
    windowElement.style.zIndex = this.windows.get(id).zIndex;

    // Focus the new window
    this.focus(id);

    // Dispatch registration event
    this.dispatchEvent(
      new CustomEvent("window-registered", {
        detail: { id, title: options.title, icon: options.icon },
      }),
    );

    return id;
  }

  /**
   * Unregister a window from the manager
   * @param {string} id - The window ID to unregister
   */
  unregister(id) {
    const windowData = this.windows.get(id);
    if (!windowData) return;

    this.windows.delete(id);

    // If this was the active window, focus the next one
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
      new CustomEvent("window-unregistered", {
        detail: { id },
      }),
    );
  }

  /**
   * Focus a window (bring to front)
   * @param {string} id - The window ID to focus
   */
  focus(id) {
    if (this.activeWindowId === id) return;

    const windowData = this.windows.get(id);
    if (!windowData) return;

    // Deactivate previous active window
    if (this.activeWindowId) {
      const prevWindow = this.windows.get(this.activeWindowId);
      if (prevWindow) {
        prevWindow.element.setAttribute("inactive", "");
      }
    }

    // Increment global counter and apply to element
    this.zIndexCounter++;
    windowData.zIndex = this.zIndexCounter;
    windowData.element.style.zIndex = this.zIndexCounter;

    // Remove inactive state
    windowData.element.removeAttribute("inactive");

    // Update active state
    this.activeWindowId = id;

    this.dispatchEvent(
      new CustomEvent("window-focused", {
        detail: { id, title: windowData.title },
      }),
    );
  }

  /**
   * Minimize a window
   * @param {string} id - The window ID to minimize
   */
  minimize(id) {
    const windowData = this.windows.get(id);
    if (!windowData) return;

    windowData.minimized = true;
    windowData.element.style.display = "none";

    // If this was the active window, focus the next one
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
      new CustomEvent("window-minimized", {
        detail: { id, title: windowData.title },
      }),
    );
  }

  /**
   * Restore a minimized window
   * @param {string} id - The window ID to restore
   */
  restore(id) {
    const windowData = this.windows.get(id);
    if (!windowData) return;

    windowData.minimized = false;
    windowData.element.style.display = "block";

    // Focus the restored window
    this.focus(id);

    this.dispatchEvent(
      new CustomEvent("window-restored", {
        detail: { id, title: windowData.title },
      }),
    );
  }

  /**
   * Get all windows
   * @returns {Array} Array of window data objects
   */
  getAllWindows() {
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
   * @returns {number} Number of windows
   */
  getWindowCount() {
    return this.windows.size;
  }

  /**
   * Get a specific window by ID
   * @param {string} id - The window ID
   * @returns {Object|null} Window data or null if not found
   */
  getWindow(id) {
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
   * @param {string} id - The window ID
   * @param {Object} updates - Properties to update
   */
  updateWindow(id, updates) {
    const windowData = this.windows.get(id);
    if (!windowData) return;

    if (updates.title !== undefined) {
      windowData.title = updates.title;
    }
    if (updates.icon !== undefined) {
      windowData.icon = updates.icon;
    }

    this.dispatchEvent(
      new CustomEvent("window-updated", {
        detail: { id, updates },
      }),
    );
  }
}

// Export singleton instance
export const windowManager = new WindowManager();
