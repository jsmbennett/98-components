import win98Styles from '../css/98-overrides.css?inline';

class Win98StartMenu extends HTMLElement {
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
        display: none;
        position: absolute;
        bottom: 28px;
        left: 2px;
        z-index: 99999;
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
      }

      .sidebar {
        width: 25px;
        background: linear-gradient(to top, #000080 0%, rgb(0,0, 245) 15%, #000080 30%);
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
