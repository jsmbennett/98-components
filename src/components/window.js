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
    this.addEventListener('mousedown', () => {
      this.dispatchEvent(new CustomEvent('window-focus', {
        bubbles: true,
        composed: true
      }));
    });

    // Drag and Drop
    if (!this.hasAttribute('no-drag')) {
      titleBar.addEventListener('mousedown', (e) => {
        if (e.target.tagName === 'BUTTON') return;
        e.preventDefault();

        const rect = this.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        this._startInteraction(e, {
          onMove: (me, ghost) => {
            ghost.style.left = `${me.clientX - offsetX}px`;
            ghost.style.top = `${me.clientY - offsetY}px`;
          },
          onEnd: (ue) => {
            this.style.left = `${ue.clientX - offsetX}px`;
            this.style.top = `${ue.clientY - offsetY}px`;
          }
        });
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

        this._startInteraction(e, {
          cursor: config.cursor,
          fallback: config.fallback,
          onMove: (me, ghost, initialRect) => {
            const results = this._calculateResize(
              me.clientX - e.clientX,
              me.clientY - e.clientY,
              initialRect.width, initialRect.height, initialRect.left, initialRect.top,
              config
            );
            ghost.style.width = `${results.width}px`;
            ghost.style.height = `${results.height}px`;
            ghost.style.left = `${results.left}px`;
            ghost.style.top = `${results.top}px`;
          },
          onEnd: (ue, ghost, initialRect) => {
            const results = this._calculateResize(
              ue.clientX - e.clientX,
              ue.clientY - e.clientY,
              initialRect.width, initialRect.height, initialRect.left, initialRect.top,
              config
            );
            this.style.width = `${results.width}px`;
            this.style.height = `${results.height}px`;
            this.style.left = `${results.left}px`;
            this.style.top = `${results.top}px`;
          }
        });
      });
    });
  }

  _createGhost(rect) {
    const ghost = document.createElement('div');
    ghost.style.cssText = `
      position: fixed;
      width: ${rect.width}px;
      height: ${rect.height}px;
      left: ${rect.left}px;
      top: ${rect.top}px;
      border: 2px solid white;
      mix-blend-mode: difference;
      z-index: 99999;
      pointer-events: none;
      box-sizing: border-box;
    `;
    document.body.appendChild(ghost);
    return ghost;
  }

  _startInteraction(e, { onMove, onEnd, cursor, fallback }) {
    const rect = this.getBoundingClientRect();
    const ghost = this._createGhost(rect);
    let overlay = null;

    if (cursor) {
      overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        top: 0; left: 0; width: 100%; height: 100%;
        z-index: 99998;
        cursor: url(${cursor}) 2 2, ${fallback || 'auto'} !important;
      `;
      document.body.appendChild(overlay);
    }

    const mouseMove = (me) => onMove(me, ghost, rect);
    const mouseUp = (ue) => {
      document.removeEventListener('mousemove', mouseMove);
      document.removeEventListener('mouseup', mouseUp);
      onEnd(ue, ghost, rect);
      ghost.remove();
      if (overlay) overlay.remove();
    };

    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', mouseUp);
  }

  _calculateResize(deltaX, deltaY, startWidth, startHeight, startLeft, startTop, config) {
    const minWidth = 100;
    const minHeight = 100;
    let newWidth = startWidth;
    let newHeight = startHeight;
    let newLeft = startLeft;
    let newTop = startTop;

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

    return { width: newWidth, height: newHeight, left: newLeft, top: newTop };
  }
}

customElements.define('win98-window', Win98Window);

export default Win98Window;
