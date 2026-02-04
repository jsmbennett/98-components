import win98Styles from '../css/98-overrides.css?inline';

/**
 * @element win98-context-menu
 * @description A Windows 98-style context menu that appears on right-click
 *
 * The menu animates towards the bottom-right by default, or bottom-left if there
 * is insufficient space on the right side of the screen.
 * 
 * @attr {boolean} visible - Controls whether the menu is displayed
 * 
 * @slot - Accepts `<win98-menu-item>` and `<win98-menu-separator>` elements
 * 
 * @fires context-menu-close - Fired when the context menu is closed
 * 
 * @example
 * <win98-context-menu id="desktop-menu">
 *   <win98-menu-item icon-name="notepad" label="New"></win98-menu-item>
 *   <win98-menu-separator></win98-menu-separator>
 *   <win98-menu-item label="Properties"></win98-menu-item>
 * </win98-context-menu>
 */
class Win98ContextMenu extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._animationDirection = 'bottom-right'; // default
  }

  connectedCallback() {
    this.render();
    this.setupListeners();
  }

  disconnectedCallback() {
    this.cleanup();
  }

  static get componentStyles() {
    return `
      :host {
        display: none;
        position: fixed;
        z-index: 10001;
        font-family: var(--win98-font-family);
        font-size: var(--win98-font-size);
      }

      :host([visible]) {
        display: block;
      }

      .context-menu {
        background: var(--win98-surface);
        box-shadow: var(--win98-shadow-raised);
        padding: 2px;
        min-width: 120px;
        width: max-content;
      }

      /* Animation classes based on direction */
      :host([visible].animation-done) .context-menu {
        animation: none;
        clip-path: none !important;
        transform: none;
      }

      /* Bottom-right: expand from top-left corner (cursor position), slide toward bottom-right */
      :host([visible][data-direction="bottom-right"]) .context-menu {
        animation: context-slide-br 0.2s linear forwards;
      }

      /* Bottom-left: expand from top-right corner (cursor position), slide toward bottom-left */
      :host([visible][data-direction="bottom-left"]) .context-menu {
        animation: context-slide-bl 0.2s linear forwards;
      }

      /* Top-right: expand from bottom-left corner (cursor position), slide toward top-right */
      :host([visible][data-direction="top-right"]) .context-menu {
        animation: context-slide-tr 0.2s linear forwards;
      }

      /* Top-left: expand from bottom-right corner (cursor position), slide toward top-left */
      :host([visible][data-direction="top-left"]) .context-menu {
        animation: context-slide-tl 0.2s linear forwards;
      }

      /* Bottom-right: content slides down-right, bottom-right revealed first */
      @keyframes context-slide-br {
        from {
          clip-path: inset(100% 0 0 100%);
          transform: translate(-100%, -100%);
        }
        to {
          clip-path: inset(0 0 0 0);
          transform: translate(0, 0);
        }
      }

      /* Bottom-left: content slides down-left, bottom-left revealed first */
      @keyframes context-slide-bl {
        from {
          clip-path: inset(100% 100% 0 0);
          transform: translate(100%, -100%);
        }
        to {
          clip-path: inset(0 0 0 0);
          transform: translate(0, 0);
        }
      }

      /* Top-right: content slides up-right, top-right revealed first */
      @keyframes context-slide-tr {
        from {
          clip-path: inset(0 0 100% 100%);
          transform: translate(-100%, 100%);
        }
        to {
          clip-path: inset(0 0 0 0);
          transform: translate(0, 0);
        }
      }

      /* Top-left: content slides up-left, top-left revealed first */
      @keyframes context-slide-tl {
        from {
          clip-path: inset(0 100% 100% 0);
          transform: translate(100%, 100%);
        }
        to {
          clip-path: inset(0 0 0 0);
          transform: translate(0, 0);
        }
      }

      .menu-items {
        display: flex;
        flex-direction: column;
      }
    `;
  }

  render() {
    const win98Sheet = new CSSStyleSheet();
    win98Sheet.replaceSync(win98Styles);

    const componentSheet = new CSSStyleSheet();
    componentSheet.replaceSync(Win98ContextMenu.componentStyles);

    this.shadowRoot.adoptedStyleSheets = [win98Sheet, componentSheet];

    this.shadowRoot.innerHTML = `
      <div class="context-menu" role="menu">
        <div class="menu-items">
          <slot></slot>
        </div>
      </div>
    `;
  }

  setupListeners() {
    // Close on click outside
    this._boundOutsideClick = (e) => {
      if (this.hasAttribute('visible')) {
        const path = e.composedPath();
        if (!path.includes(this)) {
          this.hide();
        }
      }
    };
    window.addEventListener('mousedown', this._boundOutsideClick);

    // Close on menu item click
    this.addEventListener('menu-item-click', () => {
      this.hide();
    });
  }

  cleanup() {
    if (this._boundOutsideClick) {
      window.removeEventListener('mousedown', this._boundOutsideClick);
    }
  }

  /**
   * Show the context menu at the specified position
   * @param {number} x - X coordinate (typically from event.clientX)
   * @param {number} y - Y coordinate (typically from event.clientY)
   */
  show(x, y) {
    // Close all submenus first
    this.closeAllSubmenus();
    this.classList.remove('animation-done');

    // Show menu first to measure it
    this.setAttribute('visible', '');

    // Handle animation end to remove clip-path for nested submenus
    const menu = this.shadowRoot.querySelector('.context-menu');

    // Determine animation direction after menu is visible so we can measure it
    requestAnimationFrame(() => {
      const direction = this._calculateDirection(x, y, menu);
      this.setAttribute('data-direction', direction);

      if (menu) {
        const onAnimationEnd = () => {
          this.classList.add('animation-done');
          menu.removeEventListener('animationend', onAnimationEnd);
        };
        menu.addEventListener('animationend', onAnimationEnd);
      }

      // Position the menu so the appropriate corner is at the cursor
      this._positionAtCursor(x, y, direction);
    });
  }

  /**
   * Position the menu so the correct corner is at the cursor
   * @param {number} x - Cursor X position
   * @param {number} y - Cursor Y position
   * @param {string} direction - Expansion direction
   */
  _positionAtCursor(x, y, direction) {
    const menu = this.shadowRoot.querySelector('.context-menu');
    if (!menu) return;

    const rect = menu.getBoundingClientRect();
    let left = x;
    let top = y;

    // Position based on expansion direction
    // The cursor should be at the corner the menu expands FROM
    switch (direction) {
      case 'bottom-right':
        // Expand toward bottom-right, cursor at top-left of menu
        left = x;
        top = y;
        break;
      case 'bottom-left':
        // Expand toward bottom-left, cursor at top-right of menu
        left = x - rect.width;
        top = y;
        break;
      case 'top-right':
        // Expand toward top-right, cursor at bottom-left of menu
        left = x;
        top = y - rect.height;
        break;
      case 'top-left':
        // Expand toward top-left, cursor at bottom-right of menu
        left = x - rect.width;
        top = y - rect.height;
        break;
    }

    // Ensure menu stays within viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (left + rect.width > viewportWidth) {
      left = viewportWidth - rect.width - 4;
    }
    if (left < 0) {
      left = 4;
    }
    if (top + rect.height > viewportHeight) {
      top = viewportHeight - rect.height - 4;
    }
    if (top < 0) {
      top = 4;
    }

    this.style.left = `${left}px`;
    this.style.top = `${top}px`;
  }

  /**
   * Hide the context menu
   */
  hide() {
    this.removeAttribute('visible');
    this.classList.remove('animation-done');
    this.closeAllSubmenus();
    
    this.dispatchEvent(new CustomEvent('context-menu-close', {
      bubbles: true,
      composed: true
    }));
  }

  /**
   * Calculate which direction to animate based on available space
   * @param {number} x - Click X position
   * @param {number} y - Click Y position
   * @param {HTMLElement} menu - The menu element to measure
   * @returns {string} Direction: 'bottom-right' or 'bottom-left'
   */
  _calculateDirection(x, y, menu) {
    const viewportWidth = window.innerWidth;
    const menuWidth = menu ? menu.getBoundingClientRect().width : 0;

    // Default to bottom-right, but use bottom-left if there's not enough space on the right
    const spaceOnRight = viewportWidth - x;

    if (spaceOnRight < menuWidth) {
      return 'bottom-left';
    }

    return 'bottom-right';
  }

  /**
   * Close all nested submenus
   */
  closeAllSubmenus() {
    const menuItems = this.querySelectorAll('win98-menu-item');
    menuItems.forEach(item => {
      if (typeof item.closeAllSubmenus === 'function') {
        item.closeAllSubmenus();
      }
    });
  }
}

customElements.define('win98-context-menu', Win98ContextMenu);

export default Win98ContextMenu;
