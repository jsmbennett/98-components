import { LitElement, html, css, unsafeCSS } from 'lit';
import win98Styles from '../css/98-overrides.css?inline';

class Win98Button extends LitElement {
  static properties = {
    default: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true }
  };

  static styles = [
    css`${unsafeCSS(win98Styles)}`,
    css`
      :host {
        display: inline-block;
      }
    `
  ];

  constructor() {
    super();
    this.default = false;
    this.disabled = false;
  }

  render() {
    return html`
      <button
        class="${this.default ? 'default' : ''}"
        ?disabled="${this.disabled}"
        @click="${this._onClick}"
      >
        <slot></slot>
      </button>
    `;
  }

  _onClick(e) {
    if (this.disabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    this.dispatchEvent(new CustomEvent('button-click', {
      bubbles: true,
      composed: true
    }));
  }
}

customElements.define('win98-button', Win98Button);

export default Win98Button;
