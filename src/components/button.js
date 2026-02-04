import win98Styles from '../css/98-overrides.css?inline';

/**
 * @element win98-button
 * @description A Windows 98-style button component
 * 
 * @attr {boolean} default - Renders the button with a darker border indicating primary action
 * @attr {boolean} disabled - Disables the button and applies washed-out styling
 * 
 * @slot - The button label/content
 * 
 * @fires button-click - Fired when the button is clicked (only if not disabled)
 * 
 * @example
 * <win98-button>Click Me</win98-button>
 * <win98-button default>OK</win98-button>
 * <win98-button disabled>Unavailable</win98-button>
 */
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
