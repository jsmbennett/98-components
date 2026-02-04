import win98Styles from '../css/98-overrides.css?inline';
import { windowManager } from '../services/WindowManager.js';

/**
 * @typedef {Object} WindowOptions
 * @property {string} [title="Window"] - The text displayed in the title bar.
 * @property {string|null} [icon=null] - The icon to display in the title bar and taskbar.
 * @property {boolean} [resizable=false] - Whether the window can be resized by the user.
 * @property {boolean} [showHelp=false] - Whether to show the help button in the title bar.
 * @property {boolean} [statusBar=false] - Whether to show a status bar at the bottom.
 * @property {boolean} [showMinimize=true] - Whether to show the minimize button.
 * @property {boolean} [showMaximize=true] - Whether to show the maximize button.
 * @property {number} [x] - Initial X coordinate in pixels.
 * @property {number} [y] - Initial Y coordinate in pixels.
 * @property {number} [width] - Initial width in pixels.
 * @property {number} [height] - Initial height in pixels.
 * @property {string|HTMLElement} [content] - The HTML string or element to place inside the window.
 */

/**
 * Win98Desktop - The root container component.
 * 
 * This component acts as the "viewport" or "screen" for the Windows 98 environment.
 * It manages window placement, z-index stacking via the WindowManager, and provides 
 * a taskbar area.
 * 
 * @element win98-desktop
 * 
 * @slot - The default slot for `<win98-window>` elements.
 * @slot taskbar - The slot for the `<win98-taskbar>` component.
 * 
 * @cssprop [--desktop-background=#008080] - The background color of the desktop.
 * 
 * @listens window-focus - Focuses the window when it requests focus.
 * @listens window-close - Unregisters the window when it is closed.
 * @listens window-minimize - Minimizes the window when requested.
 */
class Win98Desktop extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    disconnectedCallback() {
        this.cleanup();
    }

    render() {
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(win98Styles);
        this.shadowRoot.adoptedStyleSheets = [sheet];

        this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: relative;
          width: 100%;
          height: 100vh;
          background: var(--desktop-background, #008080);
          overflow: hidden;
        }

        .desktop-container {
          position: relative;
          width: 100%;
          height: calc(100% - var(--win98-taskbar-height)); /* Reserve space for taskbar */
          overflow: hidden;
        }

        .taskbar-container {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: var(--win98-taskbar-height);
          z-index: 10000; /* Always on top */
        }

        /* Slot for windows */
        ::slotted(win98-window) {
          position: absolute;
        }
      </style>
      <div class="desktop-container" id="desktop-area">
        <slot></slot>
      </div>
      <div class="taskbar-container">
        <slot name="taskbar"></slot>
      </div>
      <slot name="context-menu"></slot>
    `;
    }

    setupEventListeners() {
        // Listen for window focus events from child windows
        this.addEventListener('window-focus', (e) => {
            const windowElement = e.target;
            const windowId = windowElement.dataset.windowId;
            if (windowId) {
                windowManager.focus(windowId);
            }
        });

        // Listen for window close events
        this.addEventListener('window-close', (e) => {
            const windowElement = e.target;
            const windowId = windowElement.dataset.windowId;
            if (windowId) {
                windowManager.unregister(windowId);
            }
        });

        // Listen for window minimize events
        this.addEventListener('window-minimize', (e) => {
            const windowElement = e.target;
            const windowId = windowElement.dataset.windowId;
            if (windowId) {
                // Get taskbar button rect for animation
                const taskbar = this.querySelector('win98-taskbar');
                const targetRect = taskbar?.getTaskButtonRect?.(windowId) || null;
                windowManager.minimize(windowId, targetRect);
            }
        });

        // Listen for window maximize events (just for logging/tracking)
        this.addEventListener('window-maximize', (e) => {
            // Window handles its own maximize, we just track it
            console.log('Window maximized:', e.target);
        });

        // Observe slot changes to register new windows
        const slot = this.shadowRoot.querySelector('slot:not([name])');
        if (slot) {
            slot.addEventListener('slotchange', () => {
                this.registerWindows();
            });
        }

        // Initial registration
        this.registerWindows();

        // Desktop right-click context menu
        const desktopArea = this.shadowRoot.getElementById('desktop-area');
        if (desktopArea) {
            desktopArea.addEventListener('contextmenu', (e) => {
                // Only show context menu if clicking directly on desktop
                if (e.target === desktopArea) {
                    e.preventDefault();
                    this.showContextMenu(e.clientX, e.clientY);
                }
            });
        }
    }

    showContextMenu(x, y) {
        const contextMenuSlot = this.shadowRoot.querySelector('slot[name="context-menu"]');
        if (contextMenuSlot) {
            const contextMenus = contextMenuSlot.assignedElements();
            if (contextMenus.length > 0 && typeof contextMenus[0].show === 'function') {
                contextMenus[0].show(x, y);
            }
        }
    }

    /**
     * Register all slotted windows with the WindowManager
     */
    registerWindows() {
        const slot = this.shadowRoot.querySelector('slot:not([name])');
        if (!slot) return;

        const windows = slot.assignedElements().filter(el => el.tagName === 'WIN98-WINDOW');

        windows.forEach(windowElement => {
            // Only register if not already registered
            if (!windowElement.dataset.windowId) {
                const title = windowElement.getAttribute('title') || 'Window';
                const icon = windowElement.getAttribute('icon') || null;

                windowManager.register(windowElement, { title, icon });
            }
        });
    }

    cleanup() {
        // Clean up event listeners if needed
    }

    /**
     * Programmatically create and add a window to the desktop.
     * 
     * @param {WindowOptions} options - Configuration for the new window.
     * @returns {HTMLElement} The created `<win98-window>` element.
     */
    createWindow(options = {}) {
        const window = document.createElement('win98-window');

        if (options.title) window.setAttribute('title', options.title);
        if (options.icon) window.setAttribute('icon', options.icon);
        if (options.resizable) window.setAttribute('resizable', '');
        if (options.showHelp) window.setAttribute('show-help', '');
        if (options.statusBar) window.setAttribute('status-bar', '');
        if (options.showMinimize !== false) window.setAttribute('show-minimize', '');
        if (options.showMaximize !== false) window.setAttribute('show-maximize', '');

        // Set initial position and size
        if (options.x !== undefined) window.style.left = `${options.x}px`;
        if (options.y !== undefined) window.style.top = `${options.y}px`;
        if (options.width !== undefined) window.style.width = `${options.width}px`;
        if (options.height !== undefined) window.style.height = `${options.height}px`;

        // Add content if provided
        if (options.content) {
            if (typeof options.content === 'string') {
                window.innerHTML = options.content;
            } else if (options.content instanceof HTMLElement) {
                window.appendChild(options.content);
            }
        }

        this.appendChild(window);

        return window;
    }

    /**
     * Get the count of all windows
     * @returns {number} Number of windows
     */
    getWindowCount() {
        return windowManager.getWindowCount();
    }

    /**
     * Get all windows
     * @returns {Array} Array of window data objects
     */
    getAllWindows() {
        return windowManager.getAllWindows();
    }

}

customElements.define('win98-desktop', Win98Desktop);

export default Win98Desktop;
