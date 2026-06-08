import { LitElement, html, css, unsafeCSS } from 'lit';
import win98Styles from '98.css?inline';
import { windowManager } from '../services/WindowManager';

interface WindowOptions {
  title?: string;
  icon?: string | null;
  resizable?: boolean;
  showHelp?: boolean;
  statusBar?: boolean;
  showMinimize?: boolean;
  showMaximize?: boolean;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  content?: string | HTMLElement;
}

class Win98Desktop extends LitElement {
  static override styles = [
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

  override connectedCallback() {
    super.connectedCallback();
    this.setupEventListeners();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.cleanup();
  }

  private setupEventListeners() {
    this.addEventListener('window-focus', (e) => {
      const windowElement = e.target as HTMLElement;
      const windowId = windowElement.dataset.windowId;
      if (windowId) {
        windowManager.focus(windowId);
      }
    });

    this.addEventListener('window-close', (e) => {
      const windowElement = e.target as HTMLElement;
      const windowId = windowElement.dataset.windowId;
      if (windowId) {
        windowManager.unregister(windowId);
      }
    });

    this.addEventListener('window-minimize', (e) => {
      const windowElement = e.target as HTMLElement;
      const windowId = windowElement.dataset.windowId;
      if (windowId) {
        windowManager.minimize(windowId);
      }
    });

    this.addEventListener('window-maximize', (e) => {
      console.log('Window maximized:', e.target);
    });

    const slot = this.renderRoot.querySelector('slot:not([name])') as HTMLSlotElement;
    if (slot) {
      slot.addEventListener('slotchange', () => {
        this.registerWindows();
      });
    }

    this.registerWindows();
  }

  private registerWindows() {
    const slot = this.renderRoot.querySelector('slot:not([name])') as HTMLSlotElement;
    if (!slot) return;

    const windows = slot.assignedElements().filter(el => el.tagName === 'WIN98-WINDOW');

    windows.forEach(windowElement => {
      if (!(windowElement as HTMLElement).dataset.windowId) {
        const title = (windowElement as HTMLElement).getAttribute('title') || 'Window';
        const icon = (windowElement as HTMLElement).getAttribute('icon') || null;

        windowManager.register(windowElement as HTMLElement, { title, icon });
      }
    });
  }

  private cleanup() {
    // Clean up event listeners if needed
  }

  override render() {
    return html`
      <div class="desktop-container">
        <slot></slot>
      </div>
      <div class="taskbar-container">
        <slot name="taskbar"></slot>
      </div>
    `;
  }

  createWindow(options: WindowOptions = {}) {
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

  getWindowCount(): number {
    return windowManager.getWindowCount();
  }

  getAllWindows() {
    return windowManager.getAllWindows();
  }
}

customElements.define('win98-desktop', Win98Desktop);

export default Win98Desktop;
