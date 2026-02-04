import win98Styles from '../css/98-overrides.css?inline';

/**
 * @element win98-start-menu
 * @description The Windows 98-style Start Menu component
 * 
 * Displays a vertical menu with the classic Windows 98 sidebar branding.
 * Typically used inside a `<win98-taskbar>` component.
 * 
 * @attr {boolean} visible - Controls whether the menu is displayed
 * 
 * @slot - Accepts `<win98-menu-item>` and `<win98-menu-separator>` elements
 * 
 * @example
 * <win98-start-menu visible>
 *   <win98-menu-item icon-name="notepad" label="Notepad" large></win98-menu-item>
 *   <win98-menu-separator></win98-menu-separator>
 *   <win98-menu-item icon-name="shutDownNormal" label="Shut Down..." large></win98-menu-item>
 * </win98-start-menu>
 */
class Win98StartMenu extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['visible'];
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        // When visibility is removed, close all submenus
        if (name === 'visible' && oldValue !== null && newValue === null) {
            this.closeAllSubmenus();
        }
    }

    closeAllSubmenus() {
        // Get all menu items from light DOM children (handles nested slots)
        const menuItems = this.querySelectorAll('win98-menu-item');
        menuItems.forEach(item => {
            if (typeof item.closeAllSubmenus === 'function') {
                item.closeAllSubmenus();
            }
        });
    }

    static get componentStyles() {
        return `
      :host {
        display: none;
        position: absolute;
        bottom: var(--win98-taskbar-height);
        left: 2px;
        z-index: -1;
        font-family: var(--win98-font-family);
        font-size: var(--win98-font-size);
      }

      :host([visible]) {
        display: block;
      }

      .start-menu {
        display: flex;
        background: var(--win98-surface);
        box-shadow: var(--win98-shadow-raised);
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
        background: linear-gradient(to top, var(--win98-highlight) 0%, rgb(0, 0, 245) 15%, var(--win98-highlight) 30%);
        display: flex;
        align-items: flex-end;
        padding-bottom: 5px;
        position: relative;
        overflow: hidden;
      }

      .sidebar-text {
        transform: rotate(-90deg);
        transform-origin: bottom left;
        color: var(--win98-highlight-text);
        font-size: 18px;
        white-space: nowrap;
        position: absolute;
        bottom: 5px;
        left: 22px; /* Adjust based on width */
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


    `;
    }

    getTemplate() {
        return `
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

    render() {
        const win98Sheet = new CSSStyleSheet();
        win98Sheet.replaceSync(win98Styles);

        const componentSheet = new CSSStyleSheet();
        componentSheet.replaceSync(Win98StartMenu.componentStyles);

        this.shadowRoot.adoptedStyleSheets = [win98Sheet, componentSheet];
        this.shadowRoot.innerHTML = this.getTemplate();
    }
}

customElements.define('win98-start-menu', Win98StartMenu);

export default Win98StartMenu;
