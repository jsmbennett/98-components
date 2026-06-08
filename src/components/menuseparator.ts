import { LitElement, html, css } from 'lit';

class Win98MenuSeparator extends LitElement {
  static override styles = css`
    :host {
      display: block;
      height: 2px;
      margin: 3px 1px;
      background: white;
      border-top: 1px solid gray;
    }
  `;

  override render() {
    return html``;
  }
}

customElements.define('win98-menu-separator', Win98MenuSeparator);

export default Win98MenuSeparator;
