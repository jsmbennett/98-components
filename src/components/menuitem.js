import win98Styles from '../css/98-overrides.css?inline';

/**
 * Win98MenuItem - A single item within a start menu or submenu.
 * Supports icons, labels, and nested submenus.
 */
class Win98MenuItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['label', 'icon', 'has-submenu', 'large'];
  }

  connectedCallback() {
    this.render();
    this.setupListeners();
    this.updateSubmenuState();
  }

  attributeChangedCallback() {
    this.render();
    this.updateSubmenuState();
  }

  setupListeners() {
    this.shadowRoot.addEventListener('click', (e) => {
      if (!this.hasSubmenu) {
        this.dispatchEvent(new CustomEvent('menu-item-click', {
          bubbles: true,
          composed: true,
          detail: { label: this.getAttribute('label') }
        }));
      }
    });

    const submenuSlot = this.shadowRoot.querySelector('slot[name="submenu"]');
    if (submenuSlot) {
      submenuSlot.addEventListener('slotchange', () => this.updateSubmenuState());
    }
  }

  updateSubmenuState() {
    const submenuSlot = this.shadowRoot.querySelector('slot[name="submenu"]');
    const hasContent = submenuSlot && submenuSlot.assignedElements().length > 0;
    this.hasSubmenu = hasContent || this.hasAttribute('has-submenu');

    const arrow = this.shadowRoot.querySelector('.menu-item-arrow');
    if (arrow) {
      arrow.style.display = this.hasSubmenu ? 'block' : 'none';
    }

    const container = this.shadowRoot.querySelector('.submenu-container');
    if (container) {
      container.classList.toggle('has-items', this.hasSubmenu);
    }
  }

  static get componentStyles() {
    return `
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
        height: 22px; /* Win98 items are generally around 22-24px */
        white-space: nowrap;
        position: relative;
      }

      :host([large]) .menu-item {
        height: 38px; /* Taller for main menu */
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
        height:32px;
      }

      .menu-item-icon img, ::slotted([slot="icon"]) {
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
        display: none; /* Shown via JS if submenu exists */
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
        width: max-content; /* Fit content */
      }

      :host([large]) .submenu-container {
        left: 100%;
        top: -2px;
      }

      :host(:hover) > .submenu-container.has-items {
        display: block;
      }
    `;
  }

  render() {
    const label = this.getAttribute('label') || '';
    const icon = this.getAttribute('icon') || '';

    const win98Sheet = new CSSStyleSheet();
    win98Sheet.replaceSync(win98Styles);

    const componentSheet = new CSSStyleSheet();
    componentSheet.replaceSync(Win98MenuItem.componentStyles);

    this.shadowRoot.adoptedStyleSheets = [win98Sheet, componentSheet];

    this.shadowRoot.innerHTML = `
      <div class="menu-item" role="menuitem">
        <div class="menu-item-icon">
          ${icon ? `<img src="${icon}" alt="">` : ''}
          <slot name="icon"></slot>
        </div>
        <div class="menu-item-text">
          ${label}
          <slot></slot>
        </div>
        <div class="menu-item-arrow"></div>
      </div>
      <div class="submenu-container" role="menu">
        <slot name="submenu"></slot>
      </div>
    `;
  }
}

customElements.define('win98-menu-item', Win98MenuItem);
export default Win98MenuItem;
