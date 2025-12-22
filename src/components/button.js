import win98Styles from '98.css?inline';

class Win98Button extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ['default', 'disabled'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.shadowRoot) {
      this.render();
    }
  }

  render() {
    const isDefault = this.hasAttribute('default');
    const isDisabled = this.hasAttribute('disabled');

    const sheet = new CSSStyleSheet();
    sheet.replaceSync(win98Styles);
    this.shadowRoot.adoptedStyleSheets = [sheet];

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
        }
        button:disabled {
          cursor: default;
        }
      </style>
      <button class="${isDefault ? 'default' : ''}" ${isDisabled ? 'disabled' : ''}>
        <slot></slot>
      </button>
    `;

    this.setupInteractions();
  }

  setupInteractions() {
    const button = this.shadowRoot.querySelector('button');

    button.addEventListener('click', (e) => {
      if (!this.hasAttribute('disabled')) {
        this.dispatchEvent(new CustomEvent('button-click', {
          bubbles: true,
          composed: true
        }));
      }
    });
  }
}

customElements.define('win98-button', Win98Button);

export default Win98Button;
