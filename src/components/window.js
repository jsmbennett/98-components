import win98Styles from '98.css?inline';

class Win98Window extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ['title', 'resizable', 'inactive', 'show-help', 'status-bar', 'show-minimize', 'show-maximize'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.shadowRoot) {
      this.render();
    }
  }

  render() {
    const title = this.getAttribute('title') || 'Window';
    const inactive = this.hasAttribute('inactive');
    const showHelp = this.hasAttribute('show-help');
    const statusBar = this.hasAttribute('status-bar');
    const showMinimize = this.hasAttribute('show-minimize') !== false && !showHelp;
    const showMaximize = this.hasAttribute('show-maximize') !== false;

    const sheet = new CSSStyleSheet();
    sheet.replaceSync(win98Styles);
    this.shadowRoot.adoptedStyleSheets = [sheet];

    this.shadowRoot.innerHTML = `
      <style>
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
          overflow: auto;
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
      </style>
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

    this.setupInteractions();
  }

  setupInteractions() {
    const titleBar = this.shadowRoot.querySelector('.title-bar');
    const minimizeBtn = this.shadowRoot.querySelector('[aria-label="Minimize"]');
    const maximizeBtn = this.shadowRoot.querySelector('[aria-label="Maximize"]');
    const closeBtn = this.shadowRoot.querySelector('[aria-label="Close"]');
    const helpBtn = this.shadowRoot.querySelector('[aria-label="Help"]');

    // Drag and Drop (Native API)
    titleBar.setAttribute('draggable', 'true');

    let startX, startY;

    // Global dragover handler to allow dropping and prevent animation delay
    const dragOverHandler = (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    };

    titleBar.addEventListener('dragstart', (e) => {
      const rect = this.getBoundingClientRect();
      startX = e.clientX - rect.left;
      startY = e.clientY - rect.top;
      e.dataTransfer.effectAllowed = 'move';

      // Create custom ghost image (dotted outline)
      const ghost = document.createElement('div');
      ghost.style.width = `${rect.width}px`;
      ghost.style.height = `${rect.height}px`;
      ghost.style.border = '2px dotted black';
      ghost.style.position = 'absolute';
      ghost.style.top = '-9999px';
      ghost.style.left = '-9999px';
      ghost.style.zIndex = '9999';
      document.body.appendChild(ghost);

      e.dataTransfer.setDragImage(ghost, startX, startY);

      // Remove ghost from DOM after it's been used for the drag image
      setTimeout(() => {
        document.body.removeChild(ghost);
      }, 0);

      document.addEventListener('dragover', dragOverHandler);
    });

    titleBar.addEventListener('dragend', (e) => {
      e.preventDefault();
      document.removeEventListener('dragover', dragOverHandler);

      this.style.left = `${e.clientX - startX}px`;
      this.style.top = `${e.clientY - startY}px`;
    });

    // Controls
    if (minimizeBtn) {
      minimizeBtn.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('window-minimize', { bubbles: true, composed: true }));
        // Simple minimize behavior: toggle visibility of body
        const body = this.shadowRoot.querySelector('.window-body');
        body.style.display = body.style.display === 'none' ? 'block' : 'none';
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
