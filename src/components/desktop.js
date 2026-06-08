import { LitElement, html, css, unsafeCSS } from 'lit';
import win98Styles from '98.css?inline';
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
class Win98Desktop extends LitElement {
  static styles = [
    css`${unsafeCSS(win98Styles)}`,
    css`
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
        height: calc(100% - 28px);
        overflow: hidden;
      }

      .taskbar-container {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 28px;
        z-index: 10000;
      }

      ::slotted(win98-window) {
        position: absolute;
      }
    `
  ];

  connectedCallback() {
    super.connectedCallback();
    this.setupEventListeners();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.cleanup();
  }

  setupEventListeners() {
    this.addEventListener('window-focus', (e) => {
      const windowElement = e.target;
      const windowId = windowElement.dataset.windowId;
      if (windowId) {
        windowManager.focus(windowId);
      }
    });

    this.addEventListener('window-close', (e) => {
      const windowElement = e.target;
      const windowId = windowElement.dataset.windowId;
      if (windowId) {
        windowManager.unregister(windowId);
      }
    });

    this.addEventListener('window-minimize', (e) => {
      const windowElement = e.target;
      const windowId = windowElement.dataset.windowId;
      if (windowId) {
        windowManager.minimize(windowId);
      }
    });

    this.addEventListener('window-maximize', (e) => {
      console.log('Window maximized:', e.target);
    });

    const slot = this.renderRoot.querySelector('slot:not([name])');
    if (slot) {
      slot.addEventListener('slotchange', () => {
        this.registerWindows();
      });
    }

    this.registerWindows();
  }

  registerWindows() {
    const slot = this.renderRoot.querySelector('slot:not([name])');
    if (!slot) return;

    const windows = slot.assignedElements().filter(el => el.tagName === 'WIN98-WINDOW');

    windows.forEach(windowElement => {
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

  render() {
    return html`
      <div class="desktop-container">
        <slot></slot>
      </div>
      <div class="taskbar-container">
        <slot name="taskbar"></slot>
      </div>
    `;
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

    if (options.x !== undefined) window.style.left = `${options.x}px`;
    if (options.y !== undefined) window.style.top = `${options.y}px`;
    if (options.width !== undefined) window.style.width = `${options.width}px`;
    if (options.height !== undefined) window.style.height = `${options.height}px`;

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
