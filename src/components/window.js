import win98Styles from '../css/98-overrides.css?inline';
import { windowManager } from '../services/WindowManager.js';

/**
 * @element win98-window
 * @description A Windows 98-style window component
 * 
 * @attr {string} title - The title of the window.
 * @attr {boolean} resizable - Whether the window can be resized.
 * @attr {boolean} inactive - Whether the window is in an inactive state.
 * @attr {boolean} show-help - Whether to show the help button in the title bar.
 * @attr {boolean} status-bar - Whether to show a status bar at the bottom.
 * @attr {boolean} show-minimize - Whether to show the minimize button.
 * @attr {boolean} show-maximize - Whether to show the maximize button.
 * @attr {boolean} no-drag - Whether to disable window dragging.
 * 
 * @slot - The main content of the window.
 * @slot status - Content for the status bar.
 * 
 * @fires window-focus - Fired when the window is clicked or focused.
 * @fires window-minimize - Fired when the minimize button is clicked.
 * @fires window-maximize - Fired when the maximize button is clicked.
 * @fires window-close - Fired when the close button is clicked.
 * @fires window-help - Fired when the help button is clicked.
 */
class Win98Window extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._isInitialized = false;
  }

  connectedCallback() {
    if (!this._isInitialized) {
      this.initShadow();
      this._isInitialized = true;
    }
  }

  disconnectedCallback() {
    const windowId = this.dataset.windowId;
    if (windowId) {
      windowManager.unregister(windowId);
    }
  }

  static get observedAttributes() {
    return ['title', 'resizable', 'inactive', 'show-help', 'status-bar', 'show-minimize', 'show-maximize'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (!this._isInitialized) return;

    if (name === 'title') {
      const titleEl = this.shadowRoot.querySelector('[data-window-part="title"]');
      if (titleEl) titleEl.textContent = newValue || 'Window';
      if (this.dataset.windowId) {
        windowManager.updateWindow(this.dataset.windowId, { title: newValue });
      }
    }

    if (name === 'inactive') {
      const titleBar = this.shadowRoot.querySelector('.title-bar');
      if (titleBar) titleBar.classList.toggle('inactive', this.hasAttribute('inactive'));
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

      /* Attribute-driven visibility */
      :host(:not([status-bar])) .status-bar { display: none; }
      :host(:not([resizable])) .resize-handle { display: none; }
      
      /* Logic for which buttons to show */
      :host([show-help]) [data-window-action="minimize"],
      :host([show-help]) [data-window-action="maximize"] { display: none; }
      
      :host([show-minimize="false"]) [data-window-action="minimize"] { display: none; }
      :host([show-maximize="false"]) [data-window-action="maximize"] { display: none; }
      
      :host(:not([show-help])) [data-window-action="help"] { display: none; }

      .resize-handle {
        position: absolute;
        z-index: 10;
      }
      /* Resize handles use cursor vars if defined, fallback to standard cursors */
      .resize-handle-nw { top: -2px; left: -2px; width: 6px; height: 6px; }
      .resize-handle-n { top: -2px; left: 6px; right: 6px; height: 4px; }
      .resize-handle-ne { top: -2px; right: -2px; width: 6px; height: 6px; }
      .resize-handle-w { top: 6px; left: -2px; bottom: 6px; width: 4px; }
      .resize-handle-e { top: 6px; right: -2px; bottom: 6px; width: 4px; }
      .resize-handle-sw { bottom: -2px; left: -2px; width: 6px; height: 6px; }
      .resize-handle-s { bottom: -2px; left: 6px; right: 6px; height: 4px; }
      .resize-handle-se { bottom: -2px; right: -2px; width: 6px; height: 6px; }
    `;
  }

  initShadow() {
    const win98Sheet = new CSSStyleSheet();
    win98Sheet.replaceSync(win98Styles);
    const componentSheet = new CSSStyleSheet();
    componentSheet.replaceSync(Win98Window.componentStyles);
    this.shadowRoot.adoptedStyleSheets = [win98Sheet, componentSheet];

    this.shadowRoot.innerHTML = `
      <div class="window" data-window-part="root">
        <div class="title-bar ${this.hasAttribute('inactive') ? 'inactive' : ''}" data-window-action="drag">
          <div class="title-bar-text" data-window-part="title">${this.getAttribute('title') || 'Window'}</div>
          <div class="title-bar-controls">
            <button aria-label="Help" data-window-action="help"></button>
            <button aria-label="Minimize" data-window-action="minimize"></button>
            <button aria-label="Maximize" data-window-action="maximize"></button>
            <button aria-label="Close" data-window-action="close"></button>
          </div>
        </div>
        <div class="window-body">
          <slot></slot>
        </div>
        <div class="status-bar">
          <slot name="status"></slot>
        </div>
        <div class="resize-handle resize-handle-nw" data-resize="nw"></div>
        <div class="resize-handle resize-handle-n" data-resize="n"></div>
        <div class="resize-handle resize-handle-ne" data-resize="ne"></div>
        <div class="resize-handle resize-handle-w" data-resize="w"></div>
        <div class="resize-handle resize-handle-e" data-resize="e"></div>
        <div class="resize-handle resize-handle-sw" data-resize="sw"></div>
        <div class="resize-handle resize-handle-s" data-resize="s"></div>
        <div class="resize-handle resize-handle-se" data-resize="se"></div>
      </div>
    `;

    this.setupInteractions();
  }

  setupInteractions() {
    const actionHandlers = {
      minimize: () => this.dispatchEvent(new CustomEvent('window-minimize', { bubbles: true, composed: true })),
      maximize: () => this._handleMaximize(),
      close: () => {
        this.dispatchEvent(new CustomEvent('window-close', { bubbles: true, composed: true }));
        this.remove();
      },
      help: () => this.dispatchEvent(new CustomEvent('window-help', { bubbles: true, composed: true })),
      drag: (e) => this._handleDrag(e)
    };

    // Single delegated listener for all mousedown events
    this.shadowRoot.addEventListener('mousedown', (e) => {
      // Focus window
      this.dispatchEvent(new CustomEvent('window-focus', { bubbles: true, composed: true }));

      // Find if we clicked an action element (button or title bar)
      const actionEl = e.target.closest('[data-window-action]');
      const action = actionEl?.dataset.windowAction;

      // Handle Resize handles
      if (e.target.dataset.resize && this.hasAttribute('resizable')) {
        this._handleResizeStart(e);
        return;
      }

      if (action && actionHandlers[action]) {
        // Prevent drag behavior if clicking a button
        if (e.target.tagName === 'BUTTON' && action === 'drag') return;

        actionHandlers[action](e);
      }
    });
  }

  _handleMaximize() {
    this.dispatchEvent(new CustomEvent('window-maximize', { bubbles: true, composed: true }));
    
    // Use WindowManager for animated maximize/restore
    const windowId = this.dataset.windowId;
    if (windowId) {
      windowManager.maximize(windowId);
    } else {
      // Fallback for windows not registered with WindowManager
      const isMaximized = this.style.width === '100%' && this.style.height === '100%';

      if (isMaximized) {
        this.style.width = this.dataset.prevWidth || '';
        this.style.height = this.dataset.prevHeight || '';
        this.style.top = this.dataset.prevTop || '';
        this.style.left = this.dataset.prevLeft || '';
      } else {
        this.dataset.prevWidth = this.style.width;
        this.dataset.prevHeight = this.style.height;
        this.dataset.prevTop = this.style.top;
        this.dataset.prevLeft = this.style.left;
        Object.assign(this.style, { width: '100%', height: '100%', top: '0', left: '0' });
      }
    }
  }

  _handleDrag(e) {
    if (this.hasAttribute('no-drag') || e.target.tagName === 'BUTTON') return;
    e.preventDefault();

    const rect = this.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    this._startInteraction(e, {
      cursorClass: 'cursor-drag-default',
      onMove: (me, ghost) => {
        ghost.style.left = `${me.clientX - offsetX}px`;
        ghost.style.top = `${me.clientY - offsetY}px`;
      },
      onEnd: (ue) => {
        this.style.left = `${ue.clientX - offsetX}px`;
        this.style.top = `${ue.clientY - offsetY}px`;
      }
    });
  }

  _handleResizeStart(e) {
    const dir = e.target.dataset.resize;
    const configs = {
      nw: { cursor: 'cursor-drag-nwse', x: -1, y: -1 },
      n: { cursor: 'cursor-drag-ns', x: 0, y: -1 },
      ne: { cursor: 'cursor-drag-nesw', x: 1, y: -1 },
      w: { cursor: 'cursor-drag-ew', x: -1, y: 0 },
      e: { cursor: 'cursor-drag-ew', x: 1, y: 0 },
      sw: { cursor: 'cursor-drag-nesw', x: -1, y: 1 },
      s: { cursor: 'cursor-drag-ns', x: 0, y: 1 },
      se: { cursor: 'cursor-drag-nwse', x: 1, y: 1 },
    };

    const config = configs[dir];
    e.preventDefault();
    e.stopPropagation();

    this._startInteraction(e, {
      cursorClass: config.cursor,
      onMove: (me, ghost, initialRect) => {
        const res = this._calculateResize(me.clientX - e.clientX, me.clientY - e.clientY, initialRect, config);
        Object.assign(ghost.style, { width: `${res.width}px`, height: `${res.height}px`, left: `${res.left}px`, top: `${res.top}px` });
      },
      onEnd: (ue, ghost, initialRect) => {
        const res = this._calculateResize(ue.clientX - e.clientX, ue.clientY - e.clientY, initialRect, config);
        Object.assign(this.style, { width: `${res.width}px`, height: `${res.height}px`, left: `${res.left}px`, top: `${res.top}px` });
      }
    });
  }

  _startInteraction(e, { onMove, onEnd, cursorClass }) {
    const rect = this.getBoundingClientRect();
    const ghost = this._createGhost(rect);
    const overlay = this._createOverlay(cursorClass);

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

  _createGhost(rect) {
    const ghost = document.createElement('div');
    ghost.style.cssText = `
      position: fixed; width: ${rect.width}px; height: ${rect.height}px;
      left: ${rect.left}px; top: ${rect.top}px;
      border: 2px solid white; mix-blend-mode: difference;
      z-index: 99999; pointer-events: none; box-sizing: border-box;
    `;
    document.body.appendChild(ghost);
    return ghost;
  }

  _createOverlay(cursorClass) {
    if (!cursorClass) return null;
    const overlay = document.createElement('div');
    overlay.className = cursorClass;
    overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 99998;';
    document.body.appendChild(overlay);
    return overlay;
  }

  _calculateResize(deltaX, deltaY, start, config) {
    const min = 100;
    let w = start.width, h = start.height, l = start.left, t = start.top;

    if (config.x === -1) { w = Math.max(min, start.width - deltaX); l = start.left + (start.width - w); }
    else if (config.x === 1) { w = Math.max(min, start.width + deltaX); }

    if (config.y === -1) { h = Math.max(min, start.height - deltaY); t = start.top + (start.height - h); }
    else if (config.y === 1) { h = Math.max(min, start.height + deltaY); }

    return { width: w, height: h, left: l, top: t };
  }
}

customElements.define('win98-window', Win98Window);
export default Win98Window;
