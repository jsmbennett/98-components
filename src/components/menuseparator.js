import win98Styles from '../css/98-overrides.css?inline';

/**
 * @element win98-menu-separator
 * @description A visual separator line for menus
 * 
 * Renders a horizontal divider line in the classic Windows 98 style.
 * Use between `<win98-menu-item>` elements to group related items.
 * 
 * @example
 * <win98-start-menu>
 *   <win98-menu-item label="Programs" large></win98-menu-item>
 *   <win98-menu-separator></win98-menu-separator>
 *   <win98-menu-item label="Shut Down..." large></win98-menu-item>
 * </win98-start-menu>
 */
class Win98MenuSeparator extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    static get componentStyles() {
        return `
      :host {
        display: block;
        height: 2px;
        margin: 3px 1px;
        background: var(--win98-button-highlight);
        border-top: 1px solid var(--win98-button-shadow);
      }
    `;
    }

    render() {
        const win98Sheet = new CSSStyleSheet();
        win98Sheet.replaceSync(win98Styles);

        const componentSheet = new CSSStyleSheet();
        componentSheet.replaceSync(Win98MenuSeparator.componentStyles);

        this.shadowRoot.adoptedStyleSheets = [win98Sheet, componentSheet];
        this.shadowRoot.innerHTML = ''; // Just the :host styles are needed
    }
}

customElements.define('win98-menu-separator', Win98MenuSeparator);
export default Win98MenuSeparator;
