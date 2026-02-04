import win98Styles from '../css/98-overrides.css?inline';
import { windowManager } from '../services/WindowManager.js';
import windowsLogo from '../resources/icons/misc/windows-logo-start-16x16.png';
import Win98StartMenu from './startmenu.js';

/**
 * @element win98-taskbar
 * @description The Windows 98-style taskbar component
 * 
 * Displays the Start button, task buttons for open windows, and a system tray
 * with a clock. Automatically syncs with the WindowManager to show/hide task buttons.
 * 
 * @slot start-menu - Accepts `<win98-menu-item>` elements for the Start Menu
 * 
 * @fires start-menu-toggle - Fired when the Start Menu is opened or closed. Detail: { visible: boolean }
 * 
 * @example
 * <win98-taskbar slot="taskbar">
 *   <win98-menu-item slot="start-menu" icon-name="notepad" label="Notepad" large></win98-menu-item>
 *   <win98-menu-separator slot="start-menu"></win98-menu-separator>
 *   <win98-menu-item slot="start-menu" icon-name="shutDownNormal" label="Shut Down..." large></win98-menu-item>
 * </win98-taskbar>
 */
class Win98Taskbar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.boundUpdateTasks = this.updateTasks.bind(this);
    this.taskButtons = new Map(); // Map<windowId, HTMLButtonElement>
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
          background: var(--win98-surface);
          border-top: 2px solid var(--win98-button-highlight);
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
          box-shadow: var(--win98-shadow-pressed);
          padding: 1px 7px 0 9px; /* Adjust padding to simulate press */
          outline: 1px dotted var(--win98-text);
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
          font-size: var(--win98-font-size);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-align: left;
          flex-shrink: 0;
        }

        .task-button.active {
          box-shadow: var(--win98-shadow-pressed);
          background-color: var(--win98-button-highlight);
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
          border-left: 1px solid var(--win98-button-shadow);
          border-top: 1px solid var(--win98-button-shadow);
          border-right: 1px solid var(--win98-button-highlight);
          border-bottom: 1px solid var(--win98-button-highlight);
          height: 18px;
          flex-shrink: 0;
        }

        .clock {
          font-size: var(--win98-font-size);
          padding: 0 4px;
        }
      </style>
      <div class="taskbar">
        <win98-start-menu id="start-menu">
          <slot name="start-menu"></slot>
        </win98-start-menu>
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
    const startMenu = this.shadowRoot.getElementById('start-menu');

    this.boundStartToggle = (e) => {
      e.stopPropagation();
      const isVisible = startMenu.hasAttribute('visible');

      if (isVisible) {
        this.closeStartMenu();
      } else {
        startMenu.setAttribute('visible', '');
        startButton.classList.add('active');
      }

      this.dispatchEvent(new CustomEvent('start-menu-toggle', {
        bubbles: true,
        composed: true,
        detail: { visible: !isVisible }
      }));
    };

    startButton.addEventListener('click', this.boundStartToggle);

    // Close menu when clicking outside
    this.boundOutsideClick = (e) => {
      if (startMenu.hasAttribute('visible')) {
        const path = e.composedPath();
        if (!path.includes(this.shadowRoot.querySelector('.start-button')) &&
          !path.includes(startMenu)) {
          this.closeStartMenu();
        }
      }
    };
    window.addEventListener('mousedown', this.boundOutsideClick);
  }

  closeStartMenu() {
    const startMenu = this.shadowRoot.getElementById('start-menu');
    const startButton = this.shadowRoot.querySelector('.start-button');
    
    // Close all submenus in menu items
    const menuItems = this.querySelectorAll('win98-menu-item[slot="start-menu"]');
    menuItems.forEach(item => {
      if (typeof item.closeAllSubmenus === 'function') {
        item.closeAllSubmenus();
      }
    });
    
    startMenu.removeAttribute('visible');
    startButton.classList.remove('active');
  }

  cleanup() {
    // Remove event listeners
    windowManager.removeEventListener('window-registered', this.boundUpdateTasks);
    windowManager.removeEventListener('window-unregistered', this.boundUpdateTasks);
    windowManager.removeEventListener('window-focused', this.boundUpdateTasks);
    windowManager.removeEventListener('window-minimized', this.boundUpdateTasks);
    windowManager.removeEventListener('window-restored', this.boundUpdateTasks);
    windowManager.removeEventListener('window-updated', this.boundUpdateTasks);

    // Remove event listeners
    const startButton = this.shadowRoot.querySelector('.start-button');
    if (startButton) {
      startButton.removeEventListener('click', this.boundStartToggle);
    }
    window.removeEventListener('mousedown', this.boundOutsideClick);

    // Clear clock interval
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
    }
  }

  updateTasks() {
    const taskList = this.shadowRoot.getElementById('task-list');
    if (!taskList) return;

    const windows = windowManager.getAllWindows();

    // Clear existing tasks and button references
    taskList.innerHTML = '';
    this.taskButtons.clear();

    // Create task buttons
    windows.forEach(window => {
      const button = document.createElement('button');
      button.className = 'task-button';
      button.textContent = window.title;
      button.dataset.windowId = window.id;

      // Store reference for animation targeting
      this.taskButtons.set(window.id, button);

      if (window.active) {
        button.classList.add('active');
      }
      if (window.minimized) {
        button.classList.add('minimized');
      }

      button.addEventListener('click', () => {
        const buttonRect = button.getBoundingClientRect();
        if (window.minimized) {
          windowManager.restore(window.id, buttonRect);
        } else if (window.active) {
          windowManager.minimize(window.id, buttonRect);
        } else {
          windowManager.focus(window.id);
        }
      });

      taskList.appendChild(button);
    });
  }

  /**
   * Get the bounding rect of a task button for a specific window
   * @param {string} windowId - The window ID
   * @returns {DOMRect|null} The bounding rect or null if not found
   */
  getTaskButtonRect(windowId) {
    const button = this.taskButtons.get(windowId);
    return button ? button.getBoundingClientRect() : null;
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
