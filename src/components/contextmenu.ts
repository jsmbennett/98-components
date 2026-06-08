import { LitElement, html, css, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';
import win98Styles from '../css/98-overrides.css?inline';

type AnimationDirection = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

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
class Win98ContextMenu extends LitElement {
  @property({ type: Boolean, reflect: true })
  visible = false;

  @property({ type: String, attribute: 'data-direction' })
  direction: AnimationDirection = 'bottom-right';

  private boundOutsideClick: ((e: MouseEvent) => void) | null = null;

  static override styles = [
    css`${unsafeCSS(win98Styles)}`,
    css`
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

      :host([visible].animation-done) .context-menu {
        animation: none;
        clip-path: none !important;
        transform: none;
      }

      :host([visible][data-direction="bottom-right"]) .context-menu {
        animation: context-slide-br 0.2s linear forwards;
      }

      :host([visible][data-direction="bottom-left"]) .context-menu {
        animation: context-slide-bl 0.2s linear forwards;
      }

      :host([visible][data-direction="top-right"]) .context-menu {
        animation: context-slide-tr 0.2s linear forwards;
      }

      :host([visible][data-direction="top-left"]) .context-menu {
        animation: context-slide-tl 0.2s linear forwards;
      }

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
    `
  ];

  override connectedCallback() {
    super.connectedCallback();
    this.setupListeners();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.cleanup();
  }

  private setupListeners() {
    this.boundOutsideClick = (e: MouseEvent) => {
      if (this.visible) {
        const path = (e as any).composedPath?.() || [];
        if (!path.includes(this)) {
          this.hide();
        }
      }
    };
    window.addEventListener('mousedown', this.boundOutsideClick);

    this.addEventListener('menu-item-click', () => {
      this.hide();
    });
  }

  private cleanup() {
    if (this.boundOutsideClick) {
      window.removeEventListener('mousedown', this.boundOutsideClick);
    }
  }

  show(x: number, y: number): void {
    this.closeAllSubmenus();
    this.classList.remove('animation-done');
    this.visible = true;

    requestAnimationFrame(() => {
      const menu = this.renderRoot.querySelector('.context-menu') as HTMLElement;
      if (!menu) return;

      const direction = this.calculateDirection(x, y, menu);
      this.direction = direction;

      const onAnimationEnd = () => {
        this.classList.add('animation-done');
        menu.removeEventListener('animationend', onAnimationEnd);
      };
      menu.addEventListener('animationend', onAnimationEnd);

      this.positionAtCursor(x, y, direction);
    });
  }

  private positionAtCursor(x: number, y: number, direction: AnimationDirection): void {
    const menu = this.renderRoot.querySelector('.context-menu') as HTMLElement;
    if (!menu) return;

    const rect = menu.getBoundingClientRect();
    let left = x;
    let top = y;

    switch (direction) {
      case 'bottom-right':
        left = x;
        top = y;
        break;
      case 'bottom-left':
        left = x - rect.width;
        top = y;
        break;
      case 'top-right':
        left = x;
        top = y - rect.height;
        break;
      case 'top-left':
        left = x - rect.width;
        top = y - rect.height;
        break;
    }

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

  hide(): void {
    this.visible = false;
    this.classList.remove('animation-done');
    this.closeAllSubmenus();

    this.dispatchEvent(new CustomEvent('context-menu-close', {
      bubbles: true,
      composed: true
    }));
  }

  private calculateDirection(x: number, y: number, menu: HTMLElement): AnimationDirection {
    const viewportWidth = window.innerWidth;
    const menuWidth = menu.getBoundingClientRect().width;
    const spaceOnRight = viewportWidth - x;

    if (spaceOnRight < menuWidth) {
      return 'bottom-left';
    }

    return 'bottom-right';
  }

  closeAllSubmenus(): void {
    const menuItems = this.querySelectorAll('win98-menu-item');
    menuItems.forEach((item) => {
      if (typeof (item as any).closeAllSubmenus === 'function') {
        (item as any).closeAllSubmenus();
      }
    });
  }

  override render() {
    return html`
      <div class="context-menu" role="menu">
        <div class="menu-items">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

customElements.define('win98-context-menu', Win98ContextMenu);

export default Win98ContextMenu;
