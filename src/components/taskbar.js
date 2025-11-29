import win98Styles from '98.css?inline';
import { windowManager } from '../services/WindowManager.js';

/**
 * Win98Taskbar - The taskbar component
 * 
 * Displays:
 * - Start button
 * - Task buttons for open windows
 * - System tray (optional)
 */
class Win98Taskbar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.boundUpdateTasks = this.updateTasks.bind(this);
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    this.updateTasks();
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
          flex-shrink: 0;
        }

        .start-icon {
          width: 16px;
          height: 16px;
          background: linear-gradient(135deg, #ff0000 0%, #ff6600 50%, #ffcc00 100%);
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
      </style>
      <div class="taskbar">
        <button class="start-button">
          <div class="start-icon"></div>
          <span>Start</span>
        </button>
        <div class="task-list" id="task-list"></div>
        <div class="system-tray">
          <div class="clock" id="clock"></div>
        </div>
      </div>
    `;

    // Start the clock
    this.updateClock();
    this.clockInterval = setInterval(() => this.updateClock(), 1000);
  }

  setupEventListeners() {
    // Listen to WindowManager events
    windowManager.addEventListener('window-registered', this.boundUpdateTasks);
    windowManager.addEventListener('window-unregistered', this.boundUpdateTasks);
    windowManager.addEventListener('window-focused', this.boundUpdateTasks);
    windowManager.addEventListener('window-minimized', this.boundUpdateTasks);
    windowManager.addEventListener('window-restored', this.boundUpdateTasks);
    windowManager.addEventListener('window-updated', this.boundUpdateTasks);

    // Start button click
    const startButton = this.shadowRoot.querySelector('.start-button');
    startButton.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('start-menu-toggle', {
        bubbles: true,
        composed: true
      }));
    });
  }

  cleanup() {
    // Remove event listeners
    windowManager.removeEventListener('window-registered', this.boundUpdateTasks);
    windowManager.removeEventListener('window-unregistered', this.boundUpdateTasks);
    windowManager.removeEventListener('window-focused', this.boundUpdateTasks);
    windowManager.removeEventListener('window-minimized', this.boundUpdateTasks);
    windowManager.removeEventListener('window-restored', this.boundUpdateTasks);
    windowManager.removeEventListener('window-updated', this.boundUpdateTasks);

    // Clear clock interval
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
    }
  }

  updateTasks() {
    const taskList = this.shadowRoot.getElementById('task-list');
    if (!taskList) return;

    const windows = windowManager.getAllWindows();

    // Clear existing tasks
    taskList.innerHTML = '';

    // Create task buttons
    windows.forEach(window => {
      const button = document.createElement('button');
      button.className = 'task-button';
      button.textContent = window.title;

      if (window.active) {
        button.classList.add('active');
      }
      if (window.minimized) {
        button.classList.add('minimized');
      }

      button.addEventListener('click', () => {
        if (window.minimized) {
          windowManager.restore(window.id);
        } else if (window.active) {
          windowManager.minimize(window.id);
        } else {
          windowManager.focus(window.id);
        }
      });

      taskList.appendChild(button);
    });
  }

  updateClock() {
    const clock = this.shadowRoot.getElementById('clock');
    if (!clock) return;

    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;

    clock.textContent = `${displayHours}:${minutes} ${ampm}`;
  }
}

customElements.define('win98-taskbar', Win98Taskbar);

export default Win98Taskbar;
