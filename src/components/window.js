import win98Styles from '../css/98-overrides.css?inline';
import { windowManager } from '../services/WindowManager.js';
import resizeFsCursor from '../resources/cursors/resize-fs.png';
import resizeBsCursor from '../resources/cursors/resize-bs.png';
import resizeUdCursor from '../resources/cursors/resize-ud.png';
import resizeLrCursor from '../resources/cursors/resize-lr.png';

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
        z-index: 10;
      }
      .resize-handle-nw {
        top: -2px;
        left: -2px;
        width: 6px;
        height: 6px;
        cursor: nwse-resize;
      }
      .resize-handle-n {
        top: -2px;
        left: 6px;
        right: 6px;
        height: 4px;
        cursor: ns-resize;
      }
      .resize-handle-ne {
        top: -2px;
        right: -2px;
        width: 6px;
        height: 6px;
        cursor: nesw-resize;
      }
      .resize-handle-w {
        top: 6px;
        left: -2px;
        bottom: 6px;
        width: 4px;
        cursor: ew-resize;
      }
      .resize-handle-e {
        top: 6px;
        right: -2px;
        bottom: 6px;
        width: 4px;
        cursor: ew-resize;
      }
      .resize-handle-sw {
        bottom: -2px;
        left: -2px;
        width: 6px;
        height: 6px;
        cursor: nesw-resize;
      }
      .resize-handle-s {
        bottom: -2px;
        left: 6px;
        right: 6px;
        height: 4px;
        cursor: ns-resize;
      }
      .resize-handle-se {
        bottom: -2px;
        right: -2px;
        width: 6px;
        height: 6px;
        cursor: nwse-resize;
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
        ${this.hasAttribute('resizable') ? `
          <div class="resize-handle resize-handle-nw"></div>
          <div class="resize-handle resize-handle-n"></div>
          <div class="resize-handle resize-handle-ne"></div>
          <div class="resize-handle resize-handle-w"></div>
          <div class="resize-handle resize-handle-e"></div>
          <div class="resize-handle resize-handle-sw"></div>
          <div class="resize-handle resize-handle-s"></div>
          <div class="resize-handle resize-handle-se"></div>
        ` : ''}
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
      this.setupResize();
    }
  }

  setupResize() {
    const minWidth = 100;
    const minHeight = 100;

    // Define resize configurations for each handle
    const resizeConfigs = [
      { selector: '.resize-handle-nw', cursor: resizeFsCursor, fallback: 'nwse-resize', resizeX: -1, resizeY: -1 },
      { selector: '.resize-handle-n', cursor: resizeUdCursor, fallback: 'ns-resize', resizeX: 0, resizeY: -1 },
      { selector: '.resize-handle-ne', cursor: resizeBsCursor, fallback: 'nesw-resize', resizeX: 1, resizeY: -1 },
      { selector: '.resize-handle-w', cursor: resizeLrCursor, fallback: 'ew-resize', resizeX: -1, resizeY: 0 },
      { selector: '.resize-handle-e', cursor: resizeLrCursor, fallback: 'ew-resize', resizeX: 1, resizeY: 0 },
      { selector: '.resize-handle-sw', cursor: resizeBsCursor, fallback: 'nesw-resize', resizeX: -1, resizeY: 1 },
      { selector: '.resize-handle-s', cursor: resizeUdCursor, fallback: 'ns-resize', resizeX: 0, resizeY: 1 },
      { selector: '.resize-handle-se', cursor: resizeFsCursor, fallback: 'nwse-resize', resizeX: 1, resizeY: 1 },
    ];

    resizeConfigs.forEach(config => {
      const handle = this.shadowRoot.querySelector(config.selector);
      if (!handle) return;

      handle.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const rect = this.getBoundingClientRect();
        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = parseInt(getComputedStyle(this).width, 10);
        const startHeight = parseInt(getComputedStyle(this).height, 10);
        const startLeft = rect.left;
        const startTop = rect.top;

        // Create cursor overlay to maintain resize cursor
        const cursorOverlay = document.createElement('div');
        cursorOverlay.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 99998;
          cursor: url(${config.cursor}) 2 2, ${config.fallback} !important;
        `;
        document.body.appendChild(cursorOverlay);

        // Create ghost outline with XOR effect
        const ghost = document.createElement('div');
        ghost.style.position = 'fixed';
        ghost.style.width = `${rect.width - 4}px`;
        ghost.style.height = `${rect.height - 4}px`;
        ghost.style.left = `${rect.left}px`;
        ghost.style.top = `${rect.top}px`;
        ghost.style.border = '2px solid white';
        ghost.style.mixBlendMode = 'difference';
        ghost.style.zIndex = '99999';
        ghost.style.pointerEvents = 'none';
        document.body.appendChild(ghost);

        const mouseMoveHandler = (e) => {
          const deltaX = e.clientX - startX;
          const deltaY = e.clientY - startY;

          let newWidth = startWidth;
          let newHeight = startHeight;
          let newLeft = startLeft;
          let newTop = startTop;

          // Calculate new dimensions based on resize direction
          if (config.resizeX === -1) {
            newWidth = Math.max(minWidth, startWidth - deltaX);
            newLeft = startLeft + (startWidth - newWidth);
          } else if (config.resizeX === 1) {
            newWidth = Math.max(minWidth, startWidth + deltaX);
          }

          if (config.resizeY === -1) {
            newHeight = Math.max(minHeight, startHeight - deltaY);
            newTop = startTop + (startHeight - newHeight);
          } else if (config.resizeY === 1) {
            newHeight = Math.max(minHeight, startHeight + deltaY);
          }

          ghost.style.width = `${newWidth - 4}px`;
          ghost.style.height = `${newHeight - 4}px`;
          ghost.style.left = `${newLeft}px`;
          ghost.style.top = `${newTop}px`;
        };

        const mouseUpHandler = (e) => {
          document.removeEventListener('mousemove', mouseMoveHandler);
          document.removeEventListener('mouseup', mouseUpHandler);

          const deltaX = e.clientX - startX;
          const deltaY = e.clientY - startY;

          let newWidth = startWidth;
          let newHeight = startHeight;

          // Calculate final dimensions
          if (config.resizeX === -1) {
            newWidth = Math.max(minWidth, startWidth - deltaX);
            const actualDelta = startWidth - newWidth;
            this.style.left = `${startLeft + actualDelta}px`;
          } else if (config.resizeX === 1) {
            newWidth = Math.max(minWidth, startWidth + deltaX);
          }

          if (config.resizeY === -1) {
            newHeight = Math.max(minHeight, startHeight - deltaY);
            const actualDelta = startHeight - newHeight;
            this.style.top = `${startTop + actualDelta}px`;
          } else if (config.resizeY === 1) {
            newHeight = Math.max(minHeight, startHeight + deltaY);
          }

          this.style.width = `${newWidth}px`;
          this.style.height = `${newHeight}px`;

          // Remove overlays
          document.body.removeChild(cursorOverlay);
          document.body.removeChild(ghost);
        };

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
      });
    });
  }
}

customElements.define('win98-window', Win98Window);

export default Win98Window;
