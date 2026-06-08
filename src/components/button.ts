import { LitElement, html, css, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';
import win98Styles from '../css/98-overrides.css?inline';

class Win98Button extends LitElement {
  @property({ type: Boolean, reflect: true })
  default = false;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  static override styles = [
    css`${unsafeCSS(win98Styles)}`,
    css`
      :host {
        display: inline-block;
      }
    `
  ];

  override render() {
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

  private _onClick(e: MouseEvent) {
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
