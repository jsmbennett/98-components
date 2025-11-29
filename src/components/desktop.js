import win98Styles from '98.css?inline';
import { windowManager } from '../services/WindowManager.js';

/**
 * Win98Desktop - The root container component
 * 
 * This component acts as the "viewport" or "screen" for the Windows 98 environment.
 * It provides:
 * - A relative positioning context for absolute-positioned windows
 * - A taskbar at the bottom
 * - Global window event coordination
 * - Z-index stacking management
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
          height: calc(100% - 28px); /* Reserve space for taskbar */
          overflow: hidden;
        }

        .taskbar-container {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 28px;
          z-index: 10000; /* Always on top */
        }

        /* Slot for windows */
        ::slotted(win98-window) {
          position: absolute;
        }
      </style>
      <div class="desktop-container">
        <slot></slot>
      </div>
      <div class="taskbar-container">
        <slot name="taskbar"></slot>
      </div>
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
                windowManager.minimize(windowId);
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
     * Programmatically create and add a window
     * @param {Object} options - Window configuration
     * @returns {HTMLElement} The created window element
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

    /**
     * Cascade all windows (arrange in a staggered pattern)
     * @param {Object} options - Cascade options
     */
    cascadeWindows(options = {}) {
        const {
            startX = 50,
            startY = 50,
            offsetX = 30,
            offsetY = 30,
            width = 400,
            height = 300
        } = options;

        const windows = windowManager.getAllWindows();
        windows.forEach((win, index) => {
            win.element.style.left = `${startX + (index * offsetX)}px`;
            win.element.style.top = `${startY + (index * offsetY)}px`;
            win.element.style.width = `${width}px`;
            win.element.style.height = `${height}px`;
        });
    }

    /**
     * Tile all windows (arrange in a grid)
     * @param {Object} options - Tile options
     */
    tileWindows(options = {}) {
        const windows = windowManager.getAllWindows();
        if (windows.length === 0) return;

        const { padding = 10 } = options;
        const desktopRect = this.getBoundingClientRect();
        const availableHeight = desktopRect.height - 28; // Subtract taskbar height

        const cols = Math.ceil(Math.sqrt(windows.length));
        const rows = Math.ceil(windows.length / cols);

        const windowWidth = (desktopRect.width - (padding * (cols + 1))) / cols;
        const windowHeight = (availableHeight - (padding * (rows + 1))) / rows;

        windows.forEach((win, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);

            win.element.style.left = `${padding + (col * (windowWidth + padding))}px`;
            win.element.style.top = `${padding + (row * (windowHeight + padding))}px`;
            win.element.style.width = `${windowWidth}px`;
            win.element.style.height = `${windowHeight}px`;
        });
    }
}

customElements.define('win98-desktop', Win98Desktop);

export default Win98Desktop;
