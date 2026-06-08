import { LitElement, html, css, unsafeCSS } from 'lit';
import win98Styles from '../css/98-overrides.css?inline';
import { windowManager } from '../services/WindowManager.js';
import windowsLogo from '../resources/icons/misc/windows-logo-start-16x16.png';
import './startmenu.js';

/**
 * Win98Taskbar - The taskbar component
 *
 * Displays:
 * - Start button
 * - Task buttons for open windows
 * - System tray (optional)
 */
class Win98Taskbar extends LitElement {
  static properties = {
    startMenuVisible: { type: Boolean, state: true },
    windows: { type: Array, state: true },
    clock: { type: String, state: true }
  };

  static styles = [
    css`${unsafeCSS(win98Styles)}`,
    css`
      :host {
        display: block;
        width: 100%;
        height: 21px;
      }

      .taskbar {
        display: flex;
        align-items: center;
        height: 100%;
        background: #c0c0c0;
        border-top: 2px solid #ffffff;
        padding: 2px;
        gap: 2px;
      }

      .start-button {
        height: 22px;
        padding: 0 8px;
        font-weight: bold;
        display: flex;
        align-items: center;
        gap: 4px;
        min-width: auto;
        flex-shrink: 0;
      }

      .start-button:active .start-icon,
      .start-button.active .start-icon {
        transform: translate(1px, 1px);
      }

      .start-button.active {
        box-shadow: inset -1px -1px #ffffff, inset 1px 1px #0a0a0a, inset -2px -2px #dfdfdf, inset 2px 2px #808080;
        padding: 1px 7px 0 9px;
        outline: 1px dotted #000000;
        outline-offset: -4px;
      }

      .start-icon {
        width: 16px;
        height: 16px;
        background-image: url('${windowsLogo}');
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        border-radius: 2px;
      }

      .task-list {
        display: flex;
        gap: 2px;
        flex: 1;
        overflow-x: auto;
        overflow-y: hidden;
      }

      .task-list::-webkit-scrollbar {
        height: 0;
      }

      .task-button {
        height: 22px;
        min-width: 120px;
        max-width: 160px;
        padding: 0 8px;
        font-size: 11px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: left;
        flex-shrink: 0;
      }

      .task-button.active {
        box-shadow: inset -1px -1px #ffffff, inset 1px 1px #0a0a0a, inset -2px -2px #dfdfdf, inset 2px 2px #808080;
        background-color: #ffffff;
        font-weight: 700;
      }

      .task-button.minimized {
        font-style: italic;
      }

      .system-tray {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 0 4px;
        border-left: 1px solid #808080;
        border-top: 1px solid #808080;
        border-right: 1px solid #ffffff;
        border-bottom: 1px solid #ffffff;
        height: 18px;
        flex-shrink: 0;
      }

      .clock {
        font-size: 11px;
        padding: 0 4px;
      }
    `
  ];

  constructor() {
    super();
    this.startMenuVisible = false;
    this.windows = [];
    this.clock = '12:00 AM';
    this.clockInterval = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this.setupEventListeners();
    this.updateTasks();
    this.updateClock();
    this.clockInterval = setInterval(() => this.updateClock(), 1000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.cleanup();
  }

  setupEventListeners() {
    this.boundUpdateTasks = () => this.updateTasks();

    windowManager.addEventListener('window-registered', this.boundUpdateTasks);
    windowManager.addEventListener('window-unregistered', this.boundUpdateTasks);
    windowManager.addEventListener('window-focused', this.boundUpdateTasks);
    windowManager.addEventListener('window-minimized', this.boundUpdateTasks);
    windowManager.addEventListener('window-restored', this.boundUpdateTasks);
    windowManager.addEventListener('window-updated', this.boundUpdateTasks);

    this.boundOutsideClick = (e) => {
      if (this.startMenuVisible) {
        const path = e.composedPath();
        if (!path.includes(this) && !path.includes(this.renderRoot.querySelector('win98-start-menu'))) {
          this.startMenuVisible = false;
        }
      }
    };

    window.addEventListener('mousedown', this.boundOutsideClick);
  }

  cleanup() {
    windowManager.removeEventListener('window-registered', this.boundUpdateTasks);
    windowManager.removeEventListener('window-unregistered', this.boundUpdateTasks);
    windowManager.removeEventListener('window-focused', this.boundUpdateTasks);
    windowManager.removeEventListener('window-minimized', this.boundUpdateTasks);
    windowManager.removeEventListener('window-restored', this.boundUpdateTasks);
    windowManager.removeEventListener('window-updated', this.boundUpdateTasks);

    window.removeEventListener('mousedown', this.boundOutsideClick);

    if (this.clockInterval) {
      clearInterval(this.clockInterval);
    }
  }

  updateTasks() {
    this.windows = windowManager.getAllWindows();
  }

  updateClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;

    this.clock = `${displayHours}:${minutes} ${ampm}`;
  }

  handleStartToggle(e) {
    e.stopPropagation();
    this.startMenuVisible = !this.startMenuVisible;

    this.dispatchEvent(new CustomEvent('start-menu-toggle', {
      bubbles: true,
      composed: true,
      detail: { visible: this.startMenuVisible }
    }));
  }

  handleTaskClick(window) {
    if (window.minimized) {
      windowManager.restore(window.id);
    } else if (window.active) {
      windowManager.minimize(window.id);
    } else {
      windowManager.focus(window.id);
    }
  }

  render() {
    return html`
      <div class="taskbar">
        <win98-start-menu ?visible="${this.startMenuVisible}">
          <slot name="start-menu"></slot>
        </win98-start-menu>
        <button class="start-button ${this.startMenuVisible ? 'active' : ''}" @click="${this.handleStartToggle}">
          <div class="start-icon"></div>
          <span>Start</span>
        </button>
        <div class="task-list">
          ${this.windows.map(window => html`
            <button
              class="task-button ${window.active ? 'active' : ''} ${window.minimized ? 'minimized' : ''}"
              @click="${() => this.handleTaskClick(window)}"
            >
              ${window.title}
            </button>
          `)}
        </div>
        <div class="system-tray">
          <div class="clock">${this.clock}</div>
        </div>
      </div>
    `;
  }
}

customElements.define('win98-taskbar', Win98Taskbar);

export default Win98Taskbar;
