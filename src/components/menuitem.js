import { LitElement, html, css, unsafeCSS } from 'lit';
import win98Styles from '../css/98-overrides.css?inline';

/**
 * Win98MenuItem - A single item within a start menu or submenu.
 * Supports icons, labels, and nested submenus.
 */
class Win98MenuItem extends LitElement {
  static properties = {
    label: { type: String },
    icon: { type: Object },
    large: { type: Boolean, reflect: true },
    hasSubmenu: { type: Boolean, state: true }
  };

  static styles = [
    css`${unsafeCSS(win98Styles)}`,
    css`
      :host {
        display: block;
        position: relative;
        font-family: "Pixelated MS Sans Serif", Arial, sans-serif;
        font-size: 11px;
      }

      .menu-item {
        display: flex;
        align-items: center;
        padding: 0 4px 0 6px;
        cursor: default;
        color: black;
        height: 22px;
        white-space: nowrap;
        position: relative;
      }

      :host([large]) .menu-item {
        height: 38px;
        padding: 0 8px;
        font-size: 12px;
      }

      :host(:hover) > .menu-item {
        background-color: #000080;
        color: white;
      }

      .menu-item-icon {
        width: 16px;
        height: 16px;
        margin-right: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      :host([large]) .menu-item-icon {
        width: 32px;
        height: 32px;
      }

      .menu-item-icon img,
      ::slotted([slot="icon"]) {
        max-width: 100%;
        max-height: 100%;
        image-rendering: pixelated;
      }

      .menu-item-text {
        flex: 1;
        white-space: nowrap;
        padding-right: 16px;
      }

      .menu-item-arrow {
        width: 0;
        height: 0;
        border-top: 4px solid transparent;
        border-bottom: 4px solid transparent;
        border-left: 4px solid black;
        margin-left: auto;
        display: ${c => c.hasSubmenu ? 'block' : 'none'};
      }

      :host(:hover) > .menu-item > .menu-item-arrow {
        border-left-color: white;
      }

      .submenu-container {
        display: none;
        position: absolute;
        left: calc(100% - 1px);
        top: 0;
        background: #c0c0c0;
        box-shadow: inset -1px -1px #0a0a0a, inset 1px 1px #dfdfdf, inset -2px -2px grey, inset 2px 2px #fff;
        padding: 2px;
        min-width: 120px;
        z-index: 1000;
        width: max-content;
      }

      :host([large]) .submenu-container {
        left: 100%;
        top: -2px;
      }

      :host(:hover) > .submenu-container.has-items {
        display: block;
      }
    `
  ];

  constructor() {
    super();
    this.label = '';
    this.icon = null;
    this.large = false;
    this.hasSubmenu = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.updateSubmenuState();
    this.addEventListener('click', this._onClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('click', this._onClick);
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('label') || changedProperties.has('large')) {
      this.requestUpdate();
    }
  }

  _onClick = (e) => {
    if (!this.hasSubmenu) {
      this.dispatchEvent(new CustomEvent('menu-item-click', {
        bubbles: true,
        composed: true,
        detail: { label: this.label }
      }));
    }
  };

  updateSubmenuState() {
    const slot = this.renderRoot?.querySelector('slot[name="submenu"]');
    const hasContent = slot && slot.assignedElements().length > 0;
    this.hasSubmenu = hasContent;
  }

  render() {
    let iconSrc = '';
    if (typeof this.icon === 'string') {
      iconSrc = this.icon;
    } else if (this.icon && typeof this.icon.get === 'function') {
      iconSrc = this.icon.get(this.large ? 'large' : 'small');
    }

    return html`
      <div class="menu-item" role="menuitem">
        <div class="menu-item-icon">
          ${iconSrc ? html`<img src="${iconSrc}" alt="">` : ''}
          <slot name="icon"></slot>
        </div>
        <div class="menu-item-text">
          ${this.label}
          <slot></slot>
        </div>
        <div class="menu-item-arrow"></div>
      </div>
      <div class="submenu-container has-items" role="menu" @slotchange="${this.updateSubmenuState}">
        <slot name="submenu" @slotchange="${this.updateSubmenuState}"></slot>
      </div>
    `;
  }
}

customElements.define('win98-menu-item', Win98MenuItem);
export default Win98MenuItem;
