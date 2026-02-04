import win98Styles from '../css/98-overrides.css?inline';
import { iconRegistry } from '../services/IconRegistry.js';

/**
 * @element win98-menu-item
 * @description A single item within a start menu or submenu
 * 
 * Supports icons (via registry or direct assignment), labels, and nested submenus.
 * 
 * @attr {string} label - The text label for the menu item
 * @attr {string} icon - Direct icon URL
 * @attr {string} icon-name - Icon name to look up from the iconRegistry
 * @attr {boolean} large - Whether to display the large (32px) icon variant and taller row
 * @attr {boolean} has-submenu - Whether this item has a submenu (auto-detected from slot)
 * 
 * @slot - Additional content for the menu item label
 * @slot icon - Custom icon element (alternative to icon/icon-name attributes)
 * @slot submenu - Nested `<win98-menu-item>` elements for submenus
 * 
 * @fires menu-item-click - Fired when a menu item without a submenu is clicked. Detail: { label: string }
 * 
 * @example
 * // Using icon-name with registry (declarative)
 * <win98-menu-item icon-name="directoryClosed" label="My Folder"></win98-menu-item>
 * 
 * @example
 * // With submenu
 * <win98-menu-item icon-name="directoryClosed" label="Programs" large>
 *   <div slot="submenu">
 *     <win98-menu-item icon-name="notepad" label="Notepad"></win98-menu-item>
 *     <win98-menu-item icon-name="calculator" label="Calculator"></win98-menu-item>
 *   </div>
 * </win98-menu-item>
 * 
 * @example
 * // Using direct icon property (JS required)
 * <win98-menu-item id="my-item" label="My Folder"></win98-menu-item>
 * <script>document.getElementById('my-item').icon = importedIcon;</script>
 */
class Win98MenuItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._submenuTimeout = null;
    this._submenuDelay = 350; // Windows 98 style delay in ms
  }

  static get observedAttributes() {
    return ['label', 'icon', 'icon-name', 'has-submenu', 'large'];
  }

  connectedCallback() {
    this.render();
    this.setupListeners();
    this.updateSubmenuState();
  }

  disconnectedCallback() {
    // Clean up timeout to prevent memory leaks
    if (this._submenuTimeout) {
      clearTimeout(this._submenuTimeout);
      this._submenuTimeout = null;
    }
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

    // Windows 98 style: delayed submenu opening with slide animation
    // The delay acts as "intent" - only after hovering 350ms do we close siblings and open submenu
    this.addEventListener('mouseenter', () => {
      if (this._submenuTimeout) {
        clearTimeout(this._submenuTimeout);
      }
      
      // Immediately remove highlight from siblings (but keep their submenus open)
      this.deactivateSiblings();
      
      this._submenuTimeout = setTimeout(() => {
        // Close sibling submenus only after showing intent
        this.closeSiblingSubmenus();
        
        if (this.hasSubmenu && !this.isSubmenuVisible()) {
          this.showSubmenu();
        }
      }, this._submenuDelay);
    });

    this.addEventListener('mouseleave', () => {
      // Only cancel pending timeout, don't close submenu
      // Windows 98 keeps submenus open until another is opened or click outside
      if (this._submenuTimeout) {
        clearTimeout(this._submenuTimeout);
        this._submenuTimeout = null;
      }
    });
  }

  deactivateSiblings() {
    // Remove highlight from sibling menu items (but keep their submenus open)
    const parent = this.parentElement;
    if (parent) {
      const siblings = parent.querySelectorAll(':scope > win98-menu-item');
      siblings.forEach(sibling => {
        if (sibling !== this) {
          sibling.removeAttribute('active');
        }
      });
    }
  }

  closeSiblingSubmenus() {
    // Find sibling menu items and close their submenus
    const parent = this.parentElement;
    if (parent) {
      const siblings = parent.querySelectorAll(':scope > win98-menu-item');
      siblings.forEach(sibling => {
        if (sibling !== this && typeof sibling.hideSubmenu === 'function') {
          sibling.hideSubmenu();
        }
      });
    }
  }

  showSubmenu() {
    const container = this.shadowRoot.querySelector('.submenu-container');
    if (container && this.hasSubmenu) {
      // Don't re-animate if already visible
      if (container.classList.contains('visible')) {
        return;
      }
      
      // Determine if submenu should open left or right
      const openLeft = this._shouldOpenLeft(container);
      if (openLeft) {
        container.classList.add('open-left');
      } else {
        container.classList.remove('open-left');
      }
      
      container.classList.remove('animation-done');
      container.classList.add('visible');
      
      // Mark this item as active (keeps highlight when submenu is open)
      this.setAttribute('active', '');
      
      // Remove clip-path after animation ends so nested submenus aren't clipped
      const onAnimationEnd = () => {
        container.classList.add('animation-done');
        container.removeEventListener('animationend', onAnimationEnd);
      };
      container.addEventListener('animationend', onAnimationEnd);
    }
  }

  _shouldOpenLeft(container) {
    // Check if parent already decided on left
    const parentItem = this.parentElement?.closest('win98-menu-item');
    if (parentItem) {
      const parentContainer = parentItem.shadowRoot?.querySelector('.submenu-container');
      if (parentContainer?.classList.contains('open-left')) {
        return true;
      }
    }
    
    // Check if inside a context menu that opens leftward
    const contextMenu = this.closest('win98-context-menu');
    if (contextMenu) {
      const dir = contextMenu.getAttribute('data-direction');
      if (dir && dir.includes('left')) {
        return true;
      }
    }
    
    // Check if submenu would overflow viewport
    const rect = this.getBoundingClientRect();
    const submenuWidth = 150; // estimate
    if (rect.right + submenuWidth > window.innerWidth - 10) {
      return true;
    }
    
    return false;
  }

  hideSubmenu() {
    const container = this.shadowRoot.querySelector('.submenu-container');
    if (container) {
      container.classList.remove('visible', 'animation-done');
    }
    // Remove active state when submenu closes
    this.removeAttribute('active');
  }

  closeAllSubmenus() {
    // Close own submenu
    this.hideSubmenu();
    
    // Clear any pending timeout
    if (this._submenuTimeout) {
      clearTimeout(this._submenuTimeout);
      this._submenuTimeout = null;
    }
    
    // Recursively close submenus of nested menu items
    const submenuSlot = this.shadowRoot.querySelector('slot[name="submenu"]');
    if (submenuSlot) {
      const assignedElements = submenuSlot.assignedElements();
      assignedElements.forEach(el => {
        // Handle both direct menu items and wrapper divs
        const menuItems = el.tagName === 'WIN98-MENU-ITEM' 
          ? [el] 
          : el.querySelectorAll('win98-menu-item');
        menuItems.forEach(item => {
          if (typeof item.closeAllSubmenus === 'function') {
            item.closeAllSubmenus();
          }
        });
      });
    }
  }

  isSubmenuVisible() {
    const container = this.shadowRoot.querySelector('.submenu-container');
    return container && container.classList.contains('visible');
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
        font-family: var(--win98-font-family);
        font-size: var(--win98-font-size);
      }

      .menu-item {
        display: flex;
        align-items: center;
        padding: 0 4px 0 6px;
        cursor: default;
        color: var(--win98-text);
        height: 22px; /* Win98 items are generally around 22-24px */
        white-space: nowrap;
        position: relative;
      }

      :host([large]) .menu-item {
        height: 38px; /* Taller for main menu */
        padding: 0 8px;
        font-size: 12px;
      }

      :host(:hover) > .menu-item,
      :host([active]) > .menu-item {
        background-color: var(--win98-highlight);
        color: var(--win98-highlight-text);
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
        border-left: 4px solid var(--win98-text);
        margin-left: auto;
        display: none; /* Shown via JS if submenu exists */
      }

      :host(:hover) > .menu-item > .menu-item-arrow,
      :host([active]) > .menu-item > .menu-item-arrow {
        border-left-color: var(--win98-highlight-text);
      }

      .submenu-container {
        display: none;
        position: absolute;
        left: calc(100% - 1px);
        top: 0;
        background: var(--win98-surface);
        box-shadow: var(--win98-shadow-raised);
        padding: 2px;
        min-width: 120px;
        z-index: 1000;
        width: max-content; /* Fit content */
      }

      :host([large]) .submenu-container {
        left: 100%;
        top: -2px;
      }

      /* Left-opening submenu */
      .submenu-container.open-left {
        left: auto;
        right: calc(100% - 1px);
      }

      :host([large]) .submenu-container.open-left {
        right: 100%;
      }

      /* Windows 98 style: JS-controlled visibility with slide animation */
      .submenu-container.visible.has-items {
        display: block;
        animation: submenu-slide-right 0.15s linear forwards;
      }

      /* Left-opening animation */
      .submenu-container.visible.has-items.open-left {
        animation: submenu-slide-left 0.15s linear forwards;
      }

      /* Remove clip-path after animation so nested submenus aren't clipped */
      .submenu-container.visible.has-items.animation-done {
        animation: none;
        clip-path: none !important;
        transform: none;
      }

      @keyframes submenu-slide-right {
        from {
          clip-path: inset(0 0 0 100%);
          transform: translateX(-100%);
        }
        to {
          clip-path: inset(0 0 0 0);
          transform: translateX(0);
        }
      }

      @keyframes submenu-slide-left {
        from {
          clip-path: inset(0 100% 0 0);
          transform: translateX(100%);
        }
        to {
          clip-path: inset(0 0 0 0);
          transform: translateX(0);
        }
      }
    `;
  }

  get icon() {
    return this._icon || this.getAttribute('icon');
  }

  set icon(value) {
    this._icon = value;
    this.render();
  }

  render() {
    const label = this.getAttribute('label') || '';
    const isLarge = this.hasAttribute('large');
    let iconSrc = '';
    
    // Check for icon-name attribute (registry lookup)
    const iconName = this.getAttribute('icon-name');
    if (iconName) {
      iconSrc = iconRegistry.get(iconName, isLarge ? 'large' : 'small') || '';
    } else {
      // Fall back to direct icon property/attribute
      const iconValue = this.icon;
      if (typeof iconValue === 'string') {
        iconSrc = iconValue;
      } else if (iconValue && typeof iconValue.get === 'function') {
        iconSrc = iconValue.get(isLarge ? 'large' : 'small');
      }
    }

    const win98Sheet = new CSSStyleSheet();
    win98Sheet.replaceSync(win98Styles);

    const componentSheet = new CSSStyleSheet();
    componentSheet.replaceSync(Win98MenuItem.componentStyles);

    this.shadowRoot.adoptedStyleSheets = [win98Sheet, componentSheet];

    this.shadowRoot.innerHTML = `
      <div class="menu-item" role="menuitem">
        <div class="menu-item-icon">
          ${iconSrc ? `<img src="${iconSrc}" alt="">` : ''}
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
