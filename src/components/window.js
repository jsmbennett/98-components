import win98Styles from '98.css?inline';
import { windowManager } from '../services/WindowManager.js';

class Win98Window extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  disconnectedCallback() {
    // Unregister from WindowManager when removed
    const windowId = this.dataset.windowId;
    if (windowId) {
      windowManager.unregister(windowId);
    }
  }

  static get observedAttributes() {
    return ['title', 'resizable', 'inactive', 'show-help', 'status-bar', 'show-minimize', 'show-maximize'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.shadowRoot) {
      this.render();

      // Update WindowManager if title changes
      if (name === 'title' && this.dataset.windowId) {
        windowManager.updateWindow(this.dataset.windowId, { title: newValue });
      }
    }
  }

  static get componentStyles() {
    return `
      :host {
        display: block;
        position: absolute;
      }
      .window {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
      }
      .window-body {
        flex: 1;
      }
      .resize-handle {
        position: absolute;
        bottom: -2px;
        right: -2px;
        width: 20px;
        height: 20px;
        cursor: nwse-resize;
        z-index: 10;
      }
      .maximize-animation {
        position: fixed;
        background: linear-gradient(to right, #000080, #1084d0);
        border: 2px solid white;
        mix-blend-mode: difference;
        z-index: 99999;
        pointer-events: none;
      }
    `;
  }

  getTemplate() {
    const title = this.getAttribute('title') || 'Window';
    const inactive = this.hasAttribute('inactive');
    const showHelp = this.hasAttribute('show-help');
    const statusBar = this.hasAttribute('status-bar');
    const showMinimize = this.hasAttribute('show-minimize') !== false && !showHelp;
    const showMaximize = this.hasAttribute('show-maximize') !== false;

    return `
      <div class="window">
        <div class="title-bar${inactive ? ' inactive' : ''}">
          <div class="title-bar-text">${title}</div>
          <div class="title-bar-controls">
            ${showHelp ? '<button aria-label="Help"></button>' : ''}
            ${showMinimize ? '<button aria-label="Minimize"></button>' : ''}
            ${showMaximize ? '<button aria-label="Maximize"></button>' : ''}
            <button aria-label="Close"></button>
          </div>
        </div>
        <div class="window-body">
          <slot></slot>
        </div>
        ${statusBar ? '<div class="status-bar"><slot name="status"></slot></div>' : ''}
        ${this.hasAttribute('resizable') ? '<div class="resize-handle"></div>' : ''}
      </div>
    `;
  }

  render() {
    // Import 98.css styles
    const win98Sheet = new CSSStyleSheet();
    win98Sheet.replaceSync(win98Styles);

    // Component-specific styles
    const componentSheet = new CSSStyleSheet();
    componentSheet.replaceSync(Win98Window.componentStyles);

    // Apply both stylesheets
    this.shadowRoot.adoptedStyleSheets = [win98Sheet, componentSheet];

    // Set HTML content
    this.shadowRoot.innerHTML = this.getTemplate();

    this.setupInteractions();
  }

  setupInteractions() {
    const titleBar = this.shadowRoot.querySelector('.title-bar');
    const minimizeBtn = this.shadowRoot.querySelector('[aria-label="Minimize"]');
    const maximizeBtn = this.shadowRoot.querySelector('[aria-label="Maximize"]');
    const closeBtn = this.shadowRoot.querySelector('[aria-label="Close"]');
    const helpBtn = this.shadowRoot.querySelector('[aria-label="Help"]');

    // Focus window when clicked anywhere
    this.addEventListener('mousedown', (e) => {
      this.dispatchEvent(new CustomEvent('window-focus', {
        bubbles: true,
        composed: true
      }));
    });

    // Drag and Drop (Mouse Events for XOR Visual)
    // We cannot use native Drag & Drop API because setDragImage doesn't support mix-blend-mode

    if (!this.hasAttribute('no-drag')) {
      titleBar.addEventListener('mousedown', (e) => {
        // Prevent dragging if clicking buttons
        if (e.target.tagName === 'BUTTON') return;

        e.preventDefault();

        const rect = this.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        // Create ghost outline with XOR effect
        const ghost = document.createElement('div');
        ghost.style.position = 'fixed';
        ghost.style.width = `${rect.width - 4}px`; // Adjust for border width
        ghost.style.height = `${rect.height - 4}px`;
        ghost.style.left = `${rect.left}px`;
        ghost.style.top = `${rect.top}px`;
        ghost.style.border = '2px solid white';
        ghost.style.mixBlendMode = 'difference';
        ghost.style.zIndex = '99999';
        ghost.style.pointerEvents = 'none';
        document.body.appendChild(ghost);

        const moveHandler = (moveEvent) => {
          ghost.style.left = `${moveEvent.clientX - offsetX}px`;
          ghost.style.top = `${moveEvent.clientY - offsetY}px`;
        };

        const upHandler = (upEvent) => {
          document.removeEventListener('mousemove', moveHandler);
          document.removeEventListener('mouseup', upHandler);

          // Commit position
          this.style.left = `${upEvent.clientX - offsetX}px`;
          this.style.top = `${upEvent.clientY - offsetY}px`;

          document.body.removeChild(ghost);
        };

        document.addEventListener('mousemove', moveHandler);
        document.addEventListener('mouseup', upHandler);
      });
    }

    // Controls
    if (minimizeBtn) {
      minimizeBtn.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('window-minimize', { bubbles: true, composed: true }));
      });
    }

    if (maximizeBtn) {
      maximizeBtn.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('window-maximize', { bubbles: true, composed: true }));
        // Simple maximize behavior: toggle full screen within parent
        if (this.style.width === '100%' && this.style.height === '100%') {
          this.style.width = this.dataset.prevWidth || '';
          this.style.height = this.dataset.prevHeight || '';
          this.style.top = this.dataset.prevTop || '';
          this.style.left = this.dataset.prevLeft || '';
        } else {
          this.dataset.prevWidth = this.style.width;
          this.dataset.prevHeight = this.style.height;
          this.dataset.prevTop = this.style.top;
          this.dataset.prevLeft = this.style.left;
          this.style.width = '100%';
          this.style.height = '100%';
          this.style.top = '0';
          this.style.left = '0';
        }
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('window-close', { bubbles: true, composed: true }));
        this.remove();
      });
    }

    if (helpBtn) {
      helpBtn.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('window-help', { bubbles: true, composed: true }));
      });
    }

    // Resize functionality
    if (this.hasAttribute('resizable')) {
      const resizeHandle = this.shadowRoot.querySelector('.resize-handle');
      if (resizeHandle) {
        resizeHandle.addEventListener('mousedown', (e) => {
          e.preventDefault();
          e.stopPropagation();

          const startX = e.clientX;
          const startY = e.clientY;
          const startWidth = parseInt(getComputedStyle(this).width, 10);
          const startHeight = parseInt(getComputedStyle(this).height, 10);

          const minWidth = 100;
          const minHeight = 100;

          const mouseMoveHandler = (e) => {
            const newWidth = Math.max(minWidth, startWidth + (e.clientX - startX));
            const newHeight = Math.max(minHeight, startHeight + (e.clientY - startY));
            this.style.width = `${newWidth}px`;
            this.style.height = `${newHeight}px`;
          };

          const mouseUpHandler = () => {
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
          };

          document.addEventListener('mousemove', mouseMoveHandler);
          document.addEventListener('mouseup', mouseUpHandler);
        });
      }
    }
  }
}

customElements.define('win98-window', Win98Window);

export default Win98Window;
