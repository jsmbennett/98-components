import { LitElement, html, css, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';
import win98Styles from '../css/98-overrides.css?inline';

class Win98StartMenu extends LitElement {
  @property({ type: Boolean, reflect: true })
  visible = false;

  static override styles = [
    css`${unsafeCSS(win98Styles)}`,
    css`
      :host {
        display: none;
        position: absolute;
        bottom: 28px;
        left: 2px;
        z-index: -1;
        font-family: "Pixelated MS Sans Serif", Arial, sans-serif;
        font-size: 11px;
      }

      :host([visible]) {
        display: block;
      }

      .start-menu {
        display: flex;
        background: #c0c0c0;
        box-shadow: inset -1px -1px #0a0a0a, inset 1px 1px #dfdfdf, inset -2px -2px grey, inset 2px 2px #fff;
        padding: 2px;
        min-width: 180px;
        animation: slide-up 0.15s ease-out;
        transform-origin: bottom left;
      }

      @keyframes slide-up {
        from {
          transform: translateY(100%);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      .sidebar {
        width: 25px;
        background: linear-gradient(to top, #000080 0%, rgb(0, 0, 245) 15%, #000080 30%);
        display: flex;
        align-items: flex-end;
        padding-bottom: 5px;
        position: relative;
        overflow: hidden;
      }

      .sidebar-text {
        transform: rotate(-90deg);
        transform-origin: bottom left;
        color: white;
        font-size: 18px;
        white-space: nowrap;
        position: absolute;
        bottom: 5px;
        left: 22px;
        font-family: "MS Sans Serif", Arial, sans-serif;
      }

      .sidebar-text b {
        font-weight: bold;
      }

      .sidebar-text span {
        font-weight: normal;
      }

      .menu-items {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 1px;
      }
    `
  ];

  override render() {
    return html`
      <div class="start-menu">
        <div class="sidebar">
          <div class="sidebar-text"><b>Windows</b><span>98</span></div>
        </div>
        <div class="menu-items" role="menu">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

customElements.define('win98-start-menu', Win98StartMenu);

export default Win98StartMenu;
