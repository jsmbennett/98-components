import win98Styles from '../css/98-overrides.css?inline';

/**
 * Win98MenuSeparator - A visual separator line for menus.
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
        background: white;
        border-top: 1px solid gray;
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
