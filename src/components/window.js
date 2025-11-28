class Win98Window extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ['title'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'title') {
      this.render();
    }
  }

  render() {
    const title = this.getAttribute('title') || 'Window';

    this.shadowRoot.innerHTML = `
      <style>
        @import url('/node_modules/98.css/dist/98.css');
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
      </style>
      <div class="window">
        <div class="title-bar">
          <div class="title-bar-text">${title}</div>
          <div class="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize"></button>
            <button aria-label="Close"></button>
          </div>
        </div>
        <div class="window-body">
          <slot></slot>
        </div>
      </div>
    `;

    this.setupInteractions();
  }

  setupInteractions() {
    const titleBar = this.shadowRoot.querySelector('.title-bar');
    const minimizeBtn = this.shadowRoot.querySelector('[aria-label="Minimize"]');
    const maximizeBtn = this.shadowRoot.querySelector('[aria-label="Maximize"]');
    const closeBtn = this.shadowRoot.querySelector('[aria-label="Close"]');

    // Drag and Drop
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    titleBar.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = this.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;

      // Prevent text selection during drag
      e.preventDefault();

      const moveHandler = (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        this.style.left = `${initialLeft + dx}px`;
        this.style.top = `${initialTop + dy}px`;
      };

      const upHandler = () => {
        isDragging = false;
        document.removeEventListener('mousemove', moveHandler);
        document.removeEventListener('mouseup', upHandler);
      };

      document.addEventListener('mousemove', moveHandler);
      document.addEventListener('mouseup', upHandler);
    });

    // Controls
    minimizeBtn.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('window-minimize', { bubbles: true, composed: true }));
      // Simple minimize behavior: toggle visibility of body
      const body = this.shadowRoot.querySelector('.window-body');
      body.style.display = body.style.display === 'none' ? 'block' : 'none';
    });

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

    closeBtn.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('window-close', { bubbles: true, composed: true }));
      this.remove();
    });
  }
}

customElements.define('win98-window', Win98Window);
