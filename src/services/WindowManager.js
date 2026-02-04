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
    this.windows = new Map(); // Map<id, { element, zIndex, minimized, title, icon, originalRect }>
    this.activeWindowId = null;
    this.zIndexCounter = 100;
    this.animationDuration = 200; // 200ms for Windows 98 style animation
    this.animationSteps = 4; // Number of ghost frames to show
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
   * Minimize a window with optional animation
   * @param {string} id - The window ID to minimize
   * @param {DOMRect|null} targetRect - Optional target rect for animation (taskbar button position)
   */
  minimize(id, targetRect = null) {
    const windowData = this.windows.get(id);
    if (!windowData) return;

    const element = windowData.element;
    const currentRect = element.getBoundingClientRect();

    // Store original position and size for restoration
    windowData.originalRect = {
      left: element.style.left || `${currentRect.left}px`,
      top: element.style.top || `${currentRect.top}px`,
      width: element.style.width || `${currentRect.width}px`,
      height: element.style.height || `${currentRect.height}px`,
    };

    const finishMinimize = () => {
      windowData.minimized = true;
      element.style.display = "none";

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
    };

    if (targetRect) {
      // Get title bar height BEFORE hiding the window
      const titleBar = element.shadowRoot?.querySelector(".title-bar");
      const titleBarHeight = titleBar ? titleBar.offsetHeight : 18;
      
      // Hide window immediately, animate title bar to taskbar
      element.style.display = "none";
      this._animateWindowTransition(element, currentRect, targetRect, titleBarHeight, finishMinimize);
    } else {
      finishMinimize();
    }
  }

  /**
   * Restore a minimized window with optional animation
   * @param {string} id - The window ID to restore
   * @param {DOMRect|null} sourceRect - Optional source rect for animation (taskbar button position)
   */
  restore(id, sourceRect = null) {
    const windowData = this.windows.get(id);
    if (!windowData) return;

    const element = windowData.element;

    // Get the target rect (original position)
    let targetRect;
    if (windowData.originalRect) {
      // Parse the stored original rect
      targetRect = {
        left: parseFloat(windowData.originalRect.left),
        top: parseFloat(windowData.originalRect.top),
        width: parseFloat(windowData.originalRect.width),
        height: parseFloat(windowData.originalRect.height),
      };
    } else {
      // Fallback: get current computed rect
      element.style.display = "block";
      const computed = element.getBoundingClientRect();
      targetRect = {
        left: computed.left,
        top: computed.top,
        width: computed.width,
        height: computed.height,
      };
      element.style.display = "none";
    }

    const finishRestore = () => {
      windowData.minimized = false;
      element.style.display = "block";

      // Focus the restored window
      this.focus(id);

      this.dispatchEvent(
        new CustomEvent("window-restored", {
          detail: { id, title: windowData.title },
        }),
      );
    };

    if (sourceRect) {
      // Use stored title bar height or default
      const titleBarHeight = 18; // Windows 98 title bar height
      
      // Animate title bar from taskbar to window position, then show window
      this._animateWindowTransition(element, sourceRect, targetRect, titleBarHeight, finishRestore);
    } else {
      finishRestore();
    }
  }

  /**
   * Maximize a window with animation
   * @param {string} id - The window ID to maximize
   */
  maximize(id) {
    const windowData = this.windows.get(id);
    if (!windowData) return;

    const element = windowData.element;
    const currentRect = element.getBoundingClientRect();
    
    // Check if already maximized
    const isMaximized = windowData.maximized === true;
    
    if (isMaximized) {
      // Restore from maximized - animate back to original position
      this.restoreFromMaximized(id);
      return;
    }

    // Store original position and size for restoration
    windowData.maximizedOriginalRect = {
      left: element.style.left || `${currentRect.left}px`,
      top: element.style.top || `${currentRect.top}px`,
      width: element.style.width || `${currentRect.width}px`,
      height: element.style.height || `${currentRect.height}px`,
    };

    // Get the desktop/container bounds (full screen minus taskbar)
    const container = element.closest('win98-desktop');
    const containerRect = container 
      ? container.shadowRoot.getElementById('desktop-area')?.getBoundingClientRect() 
      : { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
    
    const targetRect = {
      left: containerRect?.left || 0,
      top: containerRect?.top || 0,
      width: containerRect?.width || window.innerWidth,
      height: containerRect?.height || window.innerHeight,
    };

    // Get title bar height before animation
    const titleBar = element.shadowRoot?.querySelector(".title-bar");
    const titleBarHeight = titleBar ? titleBar.offsetHeight : 18;

    const finishMaximize = () => {
      windowData.maximized = true;
      Object.assign(element.style, { 
        width: '100%', 
        height: '100%', 
        top: '0', 
        left: '0' 
      });

      this.dispatchEvent(
        new CustomEvent("window-maximized", {
          detail: { id, title: windowData.title },
        }),
      );
    };

    // Animate title bar from current position to maximized position
    this._animateWindowTransition(element, currentRect, targetRect, titleBarHeight, finishMaximize);
  }

  /**
   * Restore a window from maximized state with animation
   * @param {string} id - The window ID to restore
   */
  restoreFromMaximized(id) {
    const windowData = this.windows.get(id);
    if (!windowData || !windowData.maximized) return;

    const element = windowData.element;
    const currentRect = element.getBoundingClientRect();

    // Get the target rect (original position before maximize)
    let targetRect;
    if (windowData.maximizedOriginalRect) {
      targetRect = {
        left: parseFloat(windowData.maximizedOriginalRect.left),
        top: parseFloat(windowData.maximizedOriginalRect.top),
        width: parseFloat(windowData.maximizedOriginalRect.width),
        height: parseFloat(windowData.maximizedOriginalRect.height),
      };
    } else {
      // Fallback to center of screen
      targetRect = {
        left: 100,
        top: 100,
        width: 400,
        height: 300,
      };
    }

    // Get title bar height
    const titleBar = element.shadowRoot?.querySelector(".title-bar");
    const titleBarHeight = titleBar ? titleBar.offsetHeight : 18;

    const finishRestore = () => {
      windowData.maximized = false;
      element.style.width = windowData.maximizedOriginalRect?.width || '';
      element.style.height = windowData.maximizedOriginalRect?.height || '';
      element.style.top = windowData.maximizedOriginalRect?.top || '';
      element.style.left = windowData.maximizedOriginalRect?.left || '';

      this.dispatchEvent(
        new CustomEvent("window-unmaximized", {
          detail: { id, title: windowData.title },
        }),
      );
    };

    // Animate title bar from maximized position to original position
    this._animateWindowTransition(element, currentRect, targetRect, titleBarHeight, finishRestore);
  }

  /**
   * Check if a window is maximized
   * @param {string} id - The window ID
   * @returns {boolean} Whether the window is maximized
   */
  isMaximized(id) {
    const windowData = this.windows.get(id);
    return windowData?.maximized === true;
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

  /**
   * Animate window transition with Windows 98 style title bar animation
   * The title bar maintains height but changes width and position
   * @param {HTMLElement} windowElement - The window element being animated
   * @param {Object} fromRect - Starting rectangle {left, top, width, height}
   * @param {Object} toRect - Ending rectangle {left, top, width, height}
   * @param {number} titleBarHeight - The height of the title bar
   * @param {Function} onComplete - Callback when animation completes
   * @private
   */
  _animateWindowTransition(windowElement, fromRect, toRect, titleBarHeight, onComplete) {
    // Create a clone of the title bar for animation
    const animatedBar = document.createElement("div");
    
    // Get the window title
    const title = windowElement.getAttribute("title") || "Window";

    // Style it like the Windows 98 title bar - always show as active (blue) during animation
    animatedBar.style.cssText = `
      position: fixed;
      left: ${fromRect.left}px;
      top: ${fromRect.top}px;
      width: ${fromRect.width}px;
      height: ${titleBarHeight}px;
      z-index: 99999;
      pointer-events: none;
      box-sizing: border-box;
      background: linear-gradient(90deg, navy, #1084d0);
      display: flex;
      align-items: center;
      padding: 2px 3px;
      transition: left ${this.animationDuration}ms linear, top ${this.animationDuration}ms linear, width ${this.animationDuration}ms linear;
      overflow: hidden;
    `;

    const titleSpan = document.createElement("span");
    titleSpan.textContent = title;
    titleSpan.style.cssText = `
      color: white;
      font-family: 'Pixelated MS Sans Serif', Arial, sans-serif;
      font-size: 11px;
      font-weight: bold;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 1;
    `;
    animatedBar.appendChild(titleSpan);

    document.body.appendChild(animatedBar);

    // Trigger reflow to ensure transition works
    animatedBar.offsetHeight;

    // Animate to target position - keep height constant
    requestAnimationFrame(() => {
      animatedBar.style.left = `${toRect.left}px`;
      animatedBar.style.top = `${toRect.top}px`;
      animatedBar.style.width = `${toRect.width}px`;
      // Height stays the same - no height transition
    });

    // Clean up after animation
    setTimeout(() => {
      animatedBar.remove();
      if (onComplete) onComplete();
    }, this.animationDuration);
  }
}

// Export singleton instance
export const windowManager = new WindowManager();
