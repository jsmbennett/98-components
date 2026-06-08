# Migration Analysis: Windows 98 Web Components Library to Lit

This document analyzes the current architecture of the Windows 98-style pure web components library and details what a transition to the [Lit framework](https://lit.dev/) would look like.

---

## 1. Architectural Differences: Pure vs. Lit

Currently, the library relies on native `HTMLElement` APIs, manual Shadow DOM creation, manual reflection of attributes via `observedAttributes` / `attributeChangedCallback`, and imperative string-interpolation updates of `innerHTML` during rendering.

Converting to Lit yields the following structural improvements:

| Feature | Current Pure Web Component Implementation | Lit Implementation |
| :--- | :--- | :--- |
| **Class Definition** | Extends `HTMLElement` | Extends `LitElement` |
| **Shadow Root Setup** | Manual `this.attachShadow({ mode: 'open' })` | Automatic (configured via `LitElement`) |
| **State & Attributes** | Explicit `observedAttributes` and custom setters/getters that call `this.render()` | `@property` or `@state` decorators / static `properties` configuration |
| **Rendering** | Imperative updates: `this.shadowRoot.innerHTML = ...` | Declarative templates using the `html` tag and Lit's fast DOM diffing |
| **CSS Stylesheets** | Dynamically replacing sheets with `adoptedStyleSheets` in the `render` method | Static `styles` class field using the `css` tag for optimal browser caching |
| **Events** | Manually query-selecting items in shadowRoot and attaching `addEventListener` | Declarative inline event bindings (e.g., `@click="${this._onClick}"`) |
| **Form Integration** | Uses `attachInternals()`, manual value handling, and custom validation | Native `ElementInternals` combined with Lit's lifecycle hooks |

---

## 2. Dependencies and Tooling Changes

To migrate, the following dependencies need to be added to `package.json`:

```json
{
  "dependencies": {
    "98.css": "^0.1.20",
    "lit": "^3.1.0"
  }
}
```

### Vite CSS Import Adjustments
Currently, styles are imported with `?inline` and synced:
```js
import win98Styles from '../css/98-overrides.css?inline';
```
In Lit, we can import raw CSS files and construct Lit `CSSResult`s, or embed styling using the `css` tag helper:
```js
import { css, unsafeCSS } from 'lit';
import win98Styles from '../css/98-overrides.css?inline';

// In the component:
static styles = [
  css`${unsafeCSS(win98Styles)}`,
  css`
    :host {
      display: inline-block;
    }
  `
];
```

---

## 3. Migration Blueprints

### Blueprint A: Button Component (`src/components/button.js`)

#### Before (Pure Web Component)
```javascript
import win98Styles from '../css/98-overrides.css?inline';

class Win98Button extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ['default', 'disabled'];
  }

  attributeChangedCallback() {
    if (this.shadowRoot) this.render();
  }

  render() {
    const isDefault = this.hasAttribute('default');
    const isDisabled = this.hasAttribute('disabled');

    const sheet = new CSSStyleSheet();
    sheet.replaceSync(win98Styles);
    this.shadowRoot.adoptedStyleSheets = [sheet];

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: inline-block; }
      </style>
      <button class="${isDefault ? 'default' : ''}" ${isDisabled ? 'disabled' : ''}>
        <slot></slot>
      </button>
    `;

    this.setupInteractions();
  }

  setupInteractions() {
    const button = this.shadowRoot.querySelector('button');
    button.addEventListener('click', (e) => {
      if (!this.hasAttribute('disabled')) {
        this.dispatchEvent(new CustomEvent('button-click', {
          bubbles: true,
          composed: true
        }));
      }
    });
  }
}
customElements.define('win98-button', Win98Button);
```

#### After (Lit Component)
```javascript
import { LitElement, html, css, unsafeCSS } from 'lit';
import win98Styles from '../css/98-overrides.css?inline';

export class Win98Button extends LitElement {
  static properties = {
    default: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true }
  };

  static styles = [
    css`${unsafeCSS(win98Styles)}`,
    css`
      :host {
        display: inline-block;
      }
    `
  ];

  constructor() {
    super();
    this.default = false;
    this.disabled = false;
  }

  render() {
    return html`
      <button 
        class="${this.default ? 'default' : ''}" 
        ?disabled="${this.disabled}"
        @click="${this._onClick}"
      >
        <slot></slot>
      </button>
    `;
  }

  _onClick(e) {
    if (this.disabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    this.dispatchEvent(new CustomEvent('button-click', {
      bubbles: true,
      composed: true
    }));
  }
}

customElements.define('win98-button', Win98Button);
```

---

### Blueprint B: Window Component (`src/components/window.js`)

For interactive components like the window (handling dragging, resizing, maximizing, and interaction with the `WindowManager` service), Lit streamlines properties and declarative attribute reflection.

```javascript
import { LitElement, html, css, unsafeCSS } from 'lit';
import win98Styles from '../css/98-overrides.css?inline';
import { windowManager } from '../services/WindowManager.js';

export class Win98Window extends LitElement {
  static properties = {
    title: { type: String },
    resizable: { type: Boolean, reflect: true },
    inactive: { type: Boolean, reflect: true },
    showHelp: { type: Boolean, attribute: 'show-help', reflect: true },
    statusBar: { type: Boolean, attribute: 'status-bar', reflect: true },
    showMinimize: { type: Boolean, attribute: 'show-minimize', reflect: true },
    showMaximize: { type: Boolean, attribute: 'show-maximize', reflect: true },
    noDrag: { type: Boolean, attribute: 'no-drag', reflect: true }
  };

  static styles = [
    css`${unsafeCSS(win98Styles)}`,
    css`
      :host {
        display: block;
        position: absolute;
      }
      .window {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
      }
      .window-body {
        flex: 1;
      }

      /* Attribute-driven visibility in Shadow DOM */
      :host(:not([status-bar])) .status-bar { display: none; }
      :host(:not([resizable])) .resize-handle { display: none; }
      
      :host([show-help]) [data-window-action="minimize"],
      :host([show-help]) [data-window-action="maximize"] { display: none; }
      
      :host([show-minimize="false"]) [data-window-action="minimize"] { display: none; }
      :host([show-maximize="false"]) [data-window-action="maximize"] { display: none; }
      
      :host(:not([show-help])) [data-window-action="help"] { display: none; }

      .resize-handle {
        position: absolute;
        z-index: 10;
      }
      .resize-handle-nw { top: -2px; left: -2px; width: 6px; height: 6px; cursor: nwse-resize; }
      .resize-handle-n { top: -2px; left: 6px; right: 6px; height: 4px; cursor: ns-resize; }
      .resize-handle-ne { top: -2px; right: -2px; width: 6px; height: 6px; cursor: nesw-resize; }
      .resize-handle-w { top: 6px; left: -2px; bottom: 6px; width: 4px; cursor: ew-resize; }
      .resize-handle-e { top: 6px; right: -2px; bottom: 6px; width: 4px; cursor: ew-resize; }
      .resize-handle-sw { bottom: -2px; left: -2px; width: 6px; height: 6px; cursor: nesw-resize; }
      .resize-handle-s { bottom: -2px; left: 6px; right: 6px; height: 4px; cursor: ns-resize; }
      .resize-handle-se { bottom: -2px; right: -2px; width: 6px; height: 6px; cursor: nwse-resize; }
    `
  ];

  constructor() {
    super();
    this.title = 'Window';
    this.resizable = false;
    this.inactive = false;
    this.showHelp = false;
    this.statusBar = false;
    this.showMinimize = true;
    this.showMaximize = true;
    this.noDrag = false;
  }

  connectedCallback() {
    super.connectedCallback();
    const title = this.getAttribute('title') || 'Window';
    const icon = this.getAttribute('icon') || null;
    windowManager.register(this, { title, icon });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    const windowId = this.dataset.windowId;
    if (windowId) {
      windowManager.unregister(windowId);
    }
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('title') && this.dataset.windowId) {
      windowManager.updateWindow(this.dataset.windowId, { title: this.title });
    }
  }

  render() {
    return html`
      <div class="window" data-window-part="root" @mousedown="${this._onMouseDown}">
        <div class="title-bar ${this.inactive ? 'inactive' : ''}" data-window-action="drag">
          <div class="title-bar-text" data-window-part="title">${this.title}</div>
          <div class="title-bar-controls">
            <button aria-label="Help" data-window-action="help"></button>
            <button aria-label="Minimize" data-window-action="minimize"></button>
            <button aria-label="Maximize" data-window-action="maximize"></button>
            <button aria-label="Close" data-window-action="close"></button>
          </div>
        </div>
        <div class="window-body">
          <slot></slot>
        </div>
        <div class="status-bar">
          <slot name="status"></slot>
        </div>
        
        <!-- Drag/Resize targets -->
        ${['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'].map(dir => html`
          <div class="resize-handle resize-handle-${dir}" data-resize="${dir}"></div>
        `)}
      </div>
    `;
  }

  _onMouseDown(e) {
    // Focus window
    this.dispatchEvent(new CustomEvent('window-focus', { bubbles: true, composed: true }));

    const actionEl = e.target.closest('[data-window-action]');
    const action = actionEl?.dataset.windowAction;

    if (e.target.dataset.resize && this.resizable) {
      this._handleResizeStart(e);
      return;
    }

    if (action) {
      if (e.target.tagName === 'BUTTON' && action === 'drag') return;
      this._handleAction(action, e);
    }
  }

  _handleAction(action, e) {
    switch (action) {
      case 'minimize':
        this.dispatchEvent(new CustomEvent('window-minimize', { bubbles: true, composed: true }));
        break;
      case 'maximize':
        this._handleMaximize();
        break;
      case 'close':
        this.dispatchEvent(new CustomEvent('window-close', { bubbles: true, composed: true }));
        this.remove();
        break;
      case 'help':
        this.dispatchEvent(new CustomEvent('window-help', { bubbles: true, composed: true }));
        break;
      case 'drag':
        this.dispatchEvent(new CustomEvent('window-updated', {
          detail: { id, updates },
        }));
      }

      this._handleDrag(e);
      break;
    }
  }

  // ... (Interaction state handlers like _handleDrag, _handleResizeStart remain similar but access/update Lit-managed class properties)
}
customElements.define('win98-window', Win98Window);
```

## 5. Adding Floating UI (`@floating-ui/dom`) for Popups & Dropdowns

Adding **Floating UI** (formerly Popper) makes significant sense for components like **dropdowns (`win98-select`)** and **menus (`win98-menu-item`/`win98-taskbar`)**. Here is why and how it should be implemented:

### Why `@floating-ui/dom` Makes Sense
1. **Viewport Collision Detection (Flip & Shift)**: 
   In a classic Windows 98 desktop environment, windows, menus, and taskbars can be placed anywhere. If a select dropdown is opened near the bottom or right edge of the screen, the popup would render off-screen. Floating UI automatically calculates placement to **flip** (e.g., open upwards instead of downwards) or **shift** (slide horizontally to stay in view).
2. **Escaping `overflow: hidden`**: 
   The desktop (`win98-desktop`), taskbar (`win98-taskbar`), and windows (`win98-window`) utilize `overflow: hidden` to clip content. Any nested absolute popups (like submenus) will get clipped. Floating UI allows rendering the dropdown/menu as a fixed-position element positioned relative to its trigger, completely bypassing parent clipping context.

---

### Implementation Blueprint with Lit

We can create a clean **Lit Controller** or direct lifecycle integration. Here is how a Floating UI positioning system can be integrated in `win98-select` using Lit:

```javascript
import { LitElement, html, css } from 'lit';
import { computePosition, flip, shift, offset } from '@floating-ui/dom';

export class Win98Select extends LitElement {
  static properties = {
    isOpen: { type: Boolean, state: true },
    options: { type: Array, state: true },
    selectedIndex: { type: Number, state: true }
  };

  // Keep references to DOM elements
  get _trigger() { return this.renderRoot.querySelector('.select-box'); }
  get _dropdown() { return this.renderRoot.querySelector('.dropdown-list'); }

  updated(changedProperties) {
    if (changedProperties.has('isOpen')) {
      if (this.isOpen) {
        this._positionDropdown();
        // Recalculate on window resize/scroll
        this._cleanupPositioning = autoUpdate(
          this._trigger,
          this._dropdown,
          () => this._positionDropdown()
        );
      } else if (this._cleanupPositioning) {
        this._cleanupPositioning();
      }
    }
  }

  _positionDropdown() {
    if (!this._trigger || !this._dropdown) return;

    computePosition(this._trigger, this._dropdown, {
      placement: 'bottom-start',
      middleware: [
        offset(2), // 2px gap matching Win98 bevel offsets
        flip(),    // Flip to top if bottom is blocked
        shift({ padding: 5 }) // Stay on screen with 5px margin
      ]
    }).then(({ x, y }) => {
      Object.assign(this._dropdown.style, {
        left: `${x}px`,
        top: `${y}px`,
        position: 'fixed' // Escapes overflow constraints
      });
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._cleanupPositioning) this._cleanupPositioning();
  }

  // render() method remains similar, but dropdown-list style includes position: fixed
}
```

---

### Handling Animations with Floating UI

In Windows 98, menus slide or snap open. With Floating UI, we can pair positioning coordinates with standard CSS transitions or Web Animations API:

1. **Transform Origin**: Floating UI tells you the placement (e.g. `'top'` or `'bottom'`). We can set `transform-origin` dynamically:
   ```js
   const origin = placement.startsWith('top') ? 'bottom left' : 'top left';
   this._dropdown.style.transformOrigin = origin;
   ```
2. **CSS Transitions**: We can toggle a class `show` or attribute `visible` on the next frame to trigger the `@keyframes slide-up` or slide-down transition, giving the menu smooth, hardware-accelerated animations while maintaining perfect, responsive placement.

---

## 6. Key Takeaways & Recommendations

1. **Incremental Migration Strategy**:
   Lit elements are standard custom elements. We can migrate them one component at a time without breaking the rest of the library since they all register in the global custom elements registry and compile down to the same web standard.
2. **Simplified Lifecycle**:
   Moving event wiring to declarative bindings in `render()` makes component code cleaner and easier to reason about.
3. **Improved Custom Event Dispatching**:
   Events like `button-click`, `window-focus`, etc., can be handled inline, decreasing querySelector overhead.
4. **Bundle size and performance**:
   Lit is extremely small (~5-6KB gzipped). Given it relies on the browser's native custom elements engine, the runtime overhead is negligible, while reactivity and DOM updates become much faster and safer than setting `innerHTML` directly.
5. **Floating UI Recommendation**:
   Highly recommended for dropdowns, menu submenus, and start menu context lists to ensure they never clip inside standard windows or get cut off by screen boundaries.
