import "98.css";
import f from "98.css?inline";
class y extends EventTarget {
  constructor() {
    super(), this.windows = /* @__PURE__ */ new Map(), this.activeWindowId = null, this.zIndexCounter = 100;
  }
  /**
   * Register a new window with the manager
   * @param {HTMLElement} windowElement - The window element to register
   * @param {Object} options - Window metadata (title, icon, etc.)
   * @returns {string} The unique ID assigned to the window
   */
  register(t, e = {}) {
    const i = crypto.randomUUID();
    return t.dataset.windowId = i, this.windows.set(i, {
      element: t,
      zIndex: this.zIndexCounter++,
      minimized: !1,
      title: e.title || "Window",
      icon: e.icon || null
    }), t.style.zIndex = this.windows.get(i).zIndex, this.focus(i), this.dispatchEvent(new CustomEvent("window-registered", {
      detail: { id: i, title: e.title, icon: e.icon }
    })), i;
  }
  /**
   * Unregister a window from the manager
   * @param {string} id - The window ID to unregister
   */
  unregister(t) {
    if (this.windows.get(t)) {
      if (this.windows.delete(t), this.activeWindowId === t) {
        this.activeWindowId = null;
        const i = Array.from(this.windows.entries()).filter(([s, n]) => !n.minimized).sort((s, n) => n[1].zIndex - s[1].zIndex)[0];
        i && this.focus(i[0]);
      }
      this.dispatchEvent(new CustomEvent("window-unregistered", {
        detail: { id: t }
      }));
    }
  }
  /**
   * Focus a window (bring to front)
   * @param {string} id - The window ID to focus
   */
  focus(t) {
    if (this.activeWindowId === t) return;
    const e = this.windows.get(t);
    if (e) {
      if (this.activeWindowId) {
        const i = this.windows.get(this.activeWindowId);
        i && i.element.setAttribute("inactive", "");
      }
      this.zIndexCounter++, e.zIndex = this.zIndexCounter, e.element.style.zIndex = this.zIndexCounter, e.element.removeAttribute("inactive"), this.activeWindowId = t, this.dispatchEvent(new CustomEvent("window-focused", {
        detail: { id: t, title: e.title }
      }));
    }
  }
  /**
   * Minimize a window
   * @param {string} id - The window ID to minimize
   */
  minimize(t) {
    const e = this.windows.get(t);
    if (e) {
      if (e.minimized = !0, e.element.style.display = "none", this.activeWindowId === t) {
        this.activeWindowId = null;
        const i = Array.from(this.windows.entries()).filter(([s, n]) => !n.minimized).sort((s, n) => n[1].zIndex - s[1].zIndex)[0];
        i && this.focus(i[0]);
      }
      this.dispatchEvent(new CustomEvent("window-minimized", {
        detail: { id: t, title: e.title }
      }));
    }
  }
  /**
   * Restore a minimized window
   * @param {string} id - The window ID to restore
   */
  restore(t) {
    const e = this.windows.get(t);
    e && (e.minimized = !1, e.element.style.display = "block", this.focus(t), this.dispatchEvent(new CustomEvent("window-restored", {
      detail: { id: t, title: e.title }
    })));
  }
  /**
   * Get all windows
   * @returns {Array} Array of window data objects
   */
  getAllWindows() {
    return Array.from(this.windows.entries()).map(([t, e]) => ({
      id: t,
      title: e.title,
      icon: e.icon,
      minimized: e.minimized,
      active: t === this.activeWindowId
    }));
  }
  /**
  * Get the count of all windows
  * @returns {number} Number of windows
  */
  getWindowCount() {
    return this.windows.size;
  }
  /**
   * Get a specific window by ID
   * @param {string} id - The window ID
   * @returns {Object|null} Window data or null if not found
   */
  getWindow(t) {
    const e = this.windows.get(t);
    return e ? {
      id: t,
      title: e.title,
      icon: e.icon,
      minimized: e.minimized,
      active: t === this.activeWindowId,
      element: e.element
    } : null;
  }
  /**
   * Update window metadata
   * @param {string} id - The window ID
   * @param {Object} updates - Properties to update
   */
  updateWindow(t, e) {
    const i = this.windows.get(t);
    i && (e.title !== void 0 && (i.title = e.title), e.icon !== void 0 && (i.icon = e.icon), this.dispatchEvent(new CustomEvent("window-updated", {
      detail: { id: t, updates: e }
    })));
  }
}
const o = new y();
class k extends HTMLElement {
  constructor() {
    super(), this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this.render();
  }
  disconnectedCallback() {
    const t = this.dataset.windowId;
    t && o.unregister(t);
  }
  static get observedAttributes() {
    return ["title", "resizable", "inactive", "show-help", "status-bar", "show-minimize", "show-maximize"];
  }
  attributeChangedCallback(t, e, i) {
    this.shadowRoot && (this.render(), t === "title" && this.dataset.windowId && o.updateWindow(this.dataset.windowId, { title: i }));
  }
  render() {
    const t = this.getAttribute("title") || "Window", e = this.hasAttribute("inactive"), i = this.hasAttribute("show-help"), s = this.hasAttribute("status-bar"), n = this.hasAttribute("show-minimize") !== !1 && !i, a = this.hasAttribute("show-maximize") !== !1, l = new CSSStyleSheet();
    l.replaceSync(f), this.shadowRoot.adoptedStyleSheets = [l], this.shadowRoot.innerHTML = `
      <style>
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
        .resize-handle {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 20px;
          height: 20px;
          cursor: nwse-resize;
          z-index: 10;
        }
      </style>
      <div class="window">
        <div class="title-bar${e ? " inactive" : ""}">
          <div class="title-bar-text">${t}</div>
          <div class="title-bar-controls">
            ${i ? '<button aria-label="Help"></button>' : ""}
            ${n ? '<button aria-label="Minimize"></button>' : ""}
            ${a ? '<button aria-label="Maximize"></button>' : ""}
            <button aria-label="Close"></button>
          </div>
        </div>
        <div class="window-body">
          <slot></slot>
        </div>
        ${s ? '<div class="status-bar"><slot name="status"></slot></div>' : ""}
        ${this.hasAttribute("resizable") ? '<div class="resize-handle"></div>' : ""}
      </div>
    `, this.setupInteractions();
  }
  setupInteractions() {
    const t = this.shadowRoot.querySelector(".title-bar"), e = this.shadowRoot.querySelector('[aria-label="Minimize"]'), i = this.shadowRoot.querySelector('[aria-label="Maximize"]'), s = this.shadowRoot.querySelector('[aria-label="Close"]'), n = this.shadowRoot.querySelector('[aria-label="Help"]');
    if (this.addEventListener("mousedown", (a) => {
      this.dispatchEvent(new CustomEvent("window-focus", {
        bubbles: !0,
        composed: !0
      }));
    }), this.hasAttribute("no-drag") || t.addEventListener("mousedown", (a) => {
      if (a.target.tagName === "BUTTON") return;
      a.preventDefault();
      const l = this.getBoundingClientRect(), c = a.clientX - l.left, r = a.clientY - l.top, d = document.createElement("div");
      d.style.position = "fixed", d.style.width = `${l.width - 4}px`, d.style.height = `${l.height - 4}px`, d.style.left = `${l.left}px`, d.style.top = `${l.top}px`, d.style.border = "2px solid white", d.style.mixBlendMode = "difference", d.style.zIndex = "99999", d.style.pointerEvents = "none", document.body.appendChild(d);
      const u = (h) => {
        d.style.left = `${h.clientX - c}px`, d.style.top = `${h.clientY - r}px`;
      }, p = (h) => {
        document.removeEventListener("mousemove", u), document.removeEventListener("mouseup", p), this.style.left = `${h.clientX - c}px`, this.style.top = `${h.clientY - r}px`, document.body.removeChild(d);
      };
      document.addEventListener("mousemove", u), document.addEventListener("mouseup", p);
    }), e && e.addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("window-minimize", { bubbles: !0, composed: !0 }));
    }), i && i.addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("window-maximize", { bubbles: !0, composed: !0 })), this.style.width === "100%" && this.style.height === "100%" ? (this.style.width = this.dataset.prevWidth || "", this.style.height = this.dataset.prevHeight || "", this.style.top = this.dataset.prevTop || "", this.style.left = this.dataset.prevLeft || "") : (this.dataset.prevWidth = this.style.width, this.dataset.prevHeight = this.style.height, this.dataset.prevTop = this.style.top, this.dataset.prevLeft = this.style.left, this.style.width = "100%", this.style.height = "100%", this.style.top = "0", this.style.left = "0");
    }), s && s.addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("window-close", { bubbles: !0, composed: !0 })), this.remove();
    }), n && n.addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("window-help", { bubbles: !0, composed: !0 }));
    }), this.hasAttribute("resizable")) {
      const a = this.shadowRoot.querySelector(".resize-handle");
      a && a.addEventListener("mousedown", (l) => {
        l.preventDefault(), l.stopPropagation();
        const c = l.clientX, r = l.clientY, d = parseInt(getComputedStyle(this).width, 10), u = parseInt(getComputedStyle(this).height, 10), p = 100, h = 100, m = (v) => {
          const x = Math.max(p, d + (v.clientX - c)), g = Math.max(h, u + (v.clientY - r));
          this.style.width = `${x}px`, this.style.height = `${g}px`;
        }, b = () => {
          document.removeEventListener("mousemove", m), document.removeEventListener("mouseup", b);
        };
        document.addEventListener("mousemove", m), document.addEventListener("mouseup", b);
      });
    }
  }
}
customElements.define("win98-window", k);
class E extends HTMLElement {
  constructor() {
    super(), this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this.render();
  }
  static get observedAttributes() {
    return ["default", "disabled"];
  }
  attributeChangedCallback(t, e, i) {
    this.shadowRoot && this.render();
  }
  render() {
    const t = this.hasAttribute("default"), e = this.hasAttribute("disabled"), i = new CSSStyleSheet();
    i.replaceSync(f), this.shadowRoot.adoptedStyleSheets = [i], this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
        }
        button {
          cursor: pointer;
        }
        button:disabled {
          cursor: default;
        }
      </style>
      <button class="${t ? "default" : ""}" ${e ? "disabled" : ""}>
        <slot></slot>
      </button>
    `, this.setupInteractions();
  }
  setupInteractions() {
    this.shadowRoot.querySelector("button").addEventListener("click", (e) => {
      this.hasAttribute("disabled") || this.dispatchEvent(new CustomEvent("button-click", {
        bubbles: !0,
        composed: !0
      }));
    });
  }
}
customElements.define("win98-button", E);
class z extends HTMLElement {
  static get formAssociated() {
    return !0;
  }
  constructor() {
    super(), this.attachShadow({ mode: "open" }), this.internals_ = this.attachInternals(), this.isOpen = !1, this.selectedIndex = -1, this.options = [], this.handleDocumentClick = this.handleDocumentClick.bind(this), this.handleKeyDown = this.handleKeyDown.bind(this);
  }
  connectedCallback() {
    this.render(), this.updateOptions(), this.shadowRoot.querySelector("slot").addEventListener("slotchange", () => {
      this.updateOptions(), this.render();
    }), document.addEventListener("click", this.handleDocumentClick), this.addEventListener("keydown", this.handleKeyDown), this.hasAttribute("tabindex") || this.setAttribute("tabindex", "0"), this.setAttribute("role", "combobox"), this.setAttribute("aria-haspopup", "listbox"), this.setAttribute("aria-expanded", "false");
  }
  disconnectedCallback() {
    document.removeEventListener("click", this.handleDocumentClick), this.removeEventListener("keydown", this.handleKeyDown);
  }
  // Form Associated API
  get form() {
    return this.internals_.form;
  }
  get name() {
    return this.getAttribute("name");
  }
  get type() {
    return this.localName;
  }
  get validity() {
    return this.internals_.validity;
  }
  get validationMessage() {
    return this.internals_.validationMessage;
  }
  get willValidate() {
    return this.internals_.willValidate;
  }
  checkValidity() {
    return this.internals_.checkValidity();
  }
  reportValidity() {
    return this.internals_.reportValidity();
  }
  get value() {
    var t;
    return ((t = this.options[this.selectedIndex]) == null ? void 0 : t.value) || "";
  }
  set value(t) {
    const e = this.options.findIndex((i) => i.value === t);
    e !== -1 && this.select(e, !1);
  }
  formResetCallback() {
    this.options.length > 0 && this.select(0, !1);
  }
  formStateRestoreCallback(t, e) {
    this.value = t;
  }
  handleDocumentClick(t) {
    this.contains(t.target) || this.close();
  }
  handleKeyDown(t) {
    if (!this.hasAttribute("disabled"))
      switch (t.key) {
        case " ":
        case "Enter":
          t.preventDefault(), this.isOpen ? this.select(this.selectedIndex) : this.toggle();
          break;
        case "Escape":
          this.isOpen && (t.preventDefault(), this.close());
          break;
        case "ArrowDown":
          t.preventDefault(), this.isOpen ? this.moveSelection(1) : this.toggle();
          break;
        case "ArrowUp":
          t.preventDefault(), this.isOpen ? this.moveSelection(-1) : this.toggle();
          break;
        case "Home":
          t.preventDefault(), this.isOpen && this.select(0, !1);
          break;
        case "End":
          t.preventDefault(), this.isOpen && this.select(this.options.length - 1, !1);
          break;
      }
  }
  moveSelection(t) {
    const e = Math.max(0, Math.min(this.options.length - 1, this.selectedIndex + t));
    this.select(e, !1), this.scrollToOption(e);
  }
  scrollToOption(t) {
    const i = this.shadowRoot.querySelector(".dropdown-list").children[t];
    i && i.scrollIntoView({ block: "nearest" });
  }
  updateOptions() {
    const e = this.shadowRoot.querySelector("slot").assignedNodes().filter((i) => i.tagName === "OPTION");
    this.options = e.map((i, s) => ({
      text: i.textContent,
      value: i.getAttribute("value") || i.textContent,
      index: s
    })), this.options.length > 0 && this.selectedIndex === -1 && this.select(0, !1);
  }
  toggle() {
    this.hasAttribute("disabled") || (this.isOpen = !this.isOpen, this.setAttribute("aria-expanded", this.isOpen), this.render(), this.isOpen && this.selectedIndex !== -1 && setTimeout(() => this.scrollToOption(this.selectedIndex), 0));
  }
  close() {
    this.isOpen && (this.isOpen = !1, this.setAttribute("aria-expanded", "false"), this.render());
  }
  select(t, e = !0) {
    t < 0 || t >= this.options.length || (this.selectedIndex = t, this.internals_.setFormValue(this.value), e ? (this.close(), this.dispatchEvent(new CustomEvent("change", {
      bubbles: !0,
      composed: !0,
      detail: {
        value: this.options[t].value,
        index: t
      }
    }))) : this.render());
  }
  render() {
    const t = new CSSStyleSheet();
    t.replaceSync(f), this.shadowRoot.adoptedStyleSheets = [t];
    const e = this.options[this.selectedIndex], i = e ? e.text : "";
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          font-family: "Pixelated MS Sans Serif", Arial, sans-serif;
          font-size: 11px;
          position: relative;
          width: 150px;
          outline: none;
        }
        
        /* Remove old focus style */
        :host(:focus) .select-box {
            outline: none;
        }

        /* Focus style for the text area */
        :host(:focus) .selected-value {
            background-color: #000080;
            color: #fff;
            outline: 1px dotted #ff0;
            outline-offset: -1px;
        }
        
        .select-box {
          background-color: #fff;
          border-bottom: 1px solid #fff;
          border-left: 1px solid #808080;
          border-right: 1px solid #fff;
          border-top: 1px solid #808080;
          box-shadow: inset -1px -1px #dfdfdf, inset 1px 1px #0a0a0a;
          box-sizing: border-box;
          color: #000;
          height: 21px;
          padding: 2px 16px 2px 2px; /* Reduced padding */
          position: relative;
          cursor: default;
          user-select: none;
          display: flex;
          align-items: center;
        }
        
        .selected-value {
            flex: 1;
            height: 100%;
            display: flex;
            align-items: center;
            padding: 0 2px;
            margin-right: 2px; /* Space for arrow */
        }

        .select-arrow {
            position: absolute;
            right: 0px;
            top: 1px;
            width: 16px;
            height: 16px;
            background-color: #c0c0c0;
            border-left: 1px solid #fff;
            border-top: 1px solid #fff;
            border-right: 1px solid #000;
            border-bottom: 1px solid #000;
            box-shadow: inset 1px 1px #dfdfdf, inset -1px -1px #808080;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .select-box:active .select-arrow {
             border-left: 1px solid #000;
            border-top: 1px solid #020202ff;
            border-right: 1px solid #fff;
            border-bottom: 1px solid #fff;
            box-shadow: inset 1px 1px #808080, inset -1px -1px #dfdfdf;
        }

        .select-arrow svg {
            width: 8px;
            height: 4px;
        }

        .dropdown-list {
          display: ${this.isOpen ? "block" : "none"};
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
          max-height: 200px;
          overflow-y: auto;
          background-color: #fff;
          border: 1px solid #000;
          z-index: 1000;
          margin-top: 1px;
        }

        .dropdown-item {
          padding: 2px 4px;
          cursor: default;
          color: #000;
          border: 1px solid transparent;
        }

        .dropdown-item:hover,
        .dropdown-item.selected {
          background-color: #000080;
          color: #fff;
        }

        .dropdown-item.selected {
          border: 1px dotted #ff0;
        }
      </style>
      
      <div class="select-box" role="button" aria-haspopup="listbox" aria-expanded="${this.isOpen}">
        <span class="selected-value">${i}</span>
        <div class="select-arrow">
            <svg width="8" height="4" viewBox="0 0 8 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M0 0H8L4 4L0 0Z" fill="black"/>
            </svg>
        </div>
      </div>
      
      <div class="dropdown-list" role="listbox">
        ${this.options.map((s, n) => `
          <div class="dropdown-item ${n === this.selectedIndex ? "selected" : ""}" 
               role="option" 
               aria-selected="${n === this.selectedIndex}"
               data-index="${n}">
            ${s.text}
          </div>
        `).join("")}
      </div>
      <slot style="display: none;"></slot>
    `, this.shadowRoot.querySelector(".select-box").addEventListener("click", () => this.toggle()), this.shadowRoot.querySelectorAll(".dropdown-item").forEach((s) => {
      s.addEventListener("mouseenter", () => {
        this.shadowRoot.querySelectorAll(".dropdown-item").forEach((n) => n.classList.remove("selected")), s.classList.add("selected");
      }), s.addEventListener("click", (n) => {
        n.stopPropagation(), this.select(parseInt(s.dataset.index));
      });
    });
  }
}
customElements.define("win98-select", z);
class S extends HTMLElement {
  constructor() {
    super(), this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this.render(), this.setupEventListeners();
  }
  disconnectedCallback() {
    this.cleanup();
  }
  render() {
    const t = new CSSStyleSheet();
    t.replaceSync(f), this.shadowRoot.adoptedStyleSheets = [t], this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: relative;
          width: 100%;
          height: 100vh;
          background: var(--desktop-background, #008080);
          overflow: hidden;
        }

        .desktop-container {
          position: relative;
          width: 100%;
          height: calc(100% - 28px); /* Reserve space for taskbar */
          overflow: hidden;
        }

        .taskbar-container {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 28px;
          z-index: 10000; /* Always on top */
        }

        /* Slot for windows */
        ::slotted(win98-window) {
          position: absolute;
        }
      </style>
      <div class="desktop-container">
        <slot></slot>
      </div>
      <div class="taskbar-container">
        <slot name="taskbar"></slot>
      </div>
    `;
  }
  setupEventListeners() {
    this.addEventListener("window-focus", (e) => {
      const s = e.target.dataset.windowId;
      s && o.focus(s);
    }), this.addEventListener("window-close", (e) => {
      const s = e.target.dataset.windowId;
      s && o.unregister(s);
    }), this.addEventListener("window-minimize", (e) => {
      const s = e.target.dataset.windowId;
      s && o.minimize(s);
    }), this.addEventListener("window-maximize", (e) => {
      console.log("Window maximized:", e.target);
    });
    const t = this.shadowRoot.querySelector("slot:not([name])");
    t && t.addEventListener("slotchange", () => {
      this.registerWindows();
    }), this.registerWindows();
  }
  /**
   * Register all slotted windows with the WindowManager
   */
  registerWindows() {
    const t = this.shadowRoot.querySelector("slot:not([name])");
    if (!t) return;
    t.assignedElements().filter((i) => i.tagName === "WIN98-WINDOW").forEach((i) => {
      if (!i.dataset.windowId) {
        const s = i.getAttribute("title") || "Window", n = i.getAttribute("icon") || null;
        o.register(i, { title: s, icon: n });
      }
    });
  }
  cleanup() {
  }
  /**
   * Programmatically create and add a window
   * @param {Object} options - Window configuration
   * @returns {HTMLElement} The created window element
   */
  createWindow(t = {}) {
    const e = document.createElement("win98-window");
    return t.title && e.setAttribute("title", t.title), t.icon && e.setAttribute("icon", t.icon), t.resizable && e.setAttribute("resizable", ""), t.showHelp && e.setAttribute("show-help", ""), t.statusBar && e.setAttribute("status-bar", ""), t.showMinimize !== !1 && e.setAttribute("show-minimize", ""), t.showMaximize !== !1 && e.setAttribute("show-maximize", ""), t.x !== void 0 && (e.style.left = `${t.x}px`), t.y !== void 0 && (e.style.top = `${t.y}px`), t.width !== void 0 && (e.style.width = `${t.width}px`), t.height !== void 0 && (e.style.height = `${t.height}px`), t.content && (typeof t.content == "string" ? e.innerHTML = t.content : t.content instanceof HTMLElement && e.appendChild(t.content)), this.appendChild(e), e;
  }
  /**
   * Get the count of all windows
   * @returns {number} Number of windows
   */
  getWindowCount() {
    return o.getWindowCount();
  }
  /**
   * Get all windows
   * @returns {Array} Array of window data objects
   */
  getAllWindows() {
    return o.getAllWindows();
  }
  /**
   * Cascade all windows (arrange in a staggered pattern)
   * @param {Object} options - Cascade options
   */
  cascadeWindows(t = {}) {
    const {
      startX: e = 50,
      startY: i = 50,
      offsetX: s = 30,
      offsetY: n = 30,
      width: a = 400,
      height: l = 300
    } = t;
    o.getAllWindows().forEach((r, d) => {
      r.element.style.left = `${e + d * s}px`, r.element.style.top = `${i + d * n}px`, r.element.style.width = `${a}px`, r.element.style.height = `${l}px`;
    });
  }
  /**
   * Tile all windows (arrange in a grid)
   * @param {Object} options - Tile options
   */
  tileWindows(t = {}) {
    const e = o.getAllWindows();
    if (e.length === 0) return;
    const { padding: i = 10 } = t, s = this.getBoundingClientRect(), n = s.height - 28, a = Math.ceil(Math.sqrt(e.length)), l = Math.ceil(e.length / a), c = (s.width - i * (a + 1)) / a, r = (n - i * (l + 1)) / l;
    e.forEach((d, u) => {
      const p = u % a, h = Math.floor(u / a);
      d.element.style.left = `${i + p * (c + i)}px`, d.element.style.top = `${i + h * (r + i)}px`, d.element.style.width = `${c}px`, d.element.style.height = `${r}px`;
    });
  }
}
customElements.define("win98-desktop", S);
class I extends HTMLElement {
  constructor() {
    super(), this.attachShadow({ mode: "open" }), this.boundUpdateTasks = this.updateTasks.bind(this);
  }
  connectedCallback() {
    this.render(), this.setupEventListeners(), this.updateTasks();
  }
  disconnectedCallback() {
    this.cleanup();
  }
  render() {
    const t = new CSSStyleSheet();
    t.replaceSync(f), this.shadowRoot.adoptedStyleSheets = [t], this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          height: 21px;
        }

        .taskbar {
          display: flex;
          align-items: center;
          height: 100%;
          background: #c0c0c0;
          border-top: 2px solid #ffffff;
          padding: 2px;
          gap: 2px;
        }

        .start-button {
          height: 22px;
          padding: 0 8px;
          font-weight: bold;
          display: flex;
          align-items: center;
          gap: 4px;
          flex-shrink: 0;
        }

        .start-icon {
          width: 16px;
          height: 16px;
          background: linear-gradient(135deg, #ff0000 0%, #ff6600 50%, #ffcc00 100%);
          border-radius: 2px;
        }

        .task-list {
          display: flex;
          gap: 2px;
          flex: 1;
          overflow-x: auto;
          overflow-y: hidden;
        }

        .task-list::-webkit-scrollbar {
          height: 0;
        }

        .task-button {
          height: 22px;
          min-width: 120px;
          max-width: 160px;
          padding: 0 8px;
          font-size: 11px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-align: left;
          flex-shrink: 0;
        }

        .task-button.active {
          box-shadow: inset -1px -1px #ffffff, inset 1px 1px #0a0a0a, inset -2px -2px #dfdfdf, inset 2px 2px #808080;
        }

        .task-button.minimized {
          font-style: italic;
        }

        .system-tray {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 0 4px;
          border-left: 1px solid #808080;
          border-top: 1px solid #808080;
          border-right: 1px solid #ffffff;
          border-bottom: 1px solid #ffffff;
          height: 18px;
          flex-shrink: 0;
        }

        .clock {
          font-size: 11px;
          padding: 0 4px;
        }
      </style>
      <div class="taskbar">
        <button class="start-button">
          <div class="start-icon"></div>
          <span>Start</span>
        </button>
        <div class="task-list" id="task-list"></div>
        <div class="system-tray">
          <div class="clock" id="clock"></div>
        </div>
      </div>
    `, this.updateClock(), this.clockInterval = setInterval(() => this.updateClock(), 1e3);
  }
  setupEventListeners() {
    o.addEventListener("window-registered", this.boundUpdateTasks), o.addEventListener("window-unregistered", this.boundUpdateTasks), o.addEventListener("window-focused", this.boundUpdateTasks), o.addEventListener("window-minimized", this.boundUpdateTasks), o.addEventListener("window-restored", this.boundUpdateTasks), o.addEventListener("window-updated", this.boundUpdateTasks), this.shadowRoot.querySelector(".start-button").addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("start-menu-toggle", {
        bubbles: !0,
        composed: !0
      }));
    });
  }
  cleanup() {
    o.removeEventListener("window-registered", this.boundUpdateTasks), o.removeEventListener("window-unregistered", this.boundUpdateTasks), o.removeEventListener("window-focused", this.boundUpdateTasks), o.removeEventListener("window-minimized", this.boundUpdateTasks), o.removeEventListener("window-restored", this.boundUpdateTasks), o.removeEventListener("window-updated", this.boundUpdateTasks), this.clockInterval && clearInterval(this.clockInterval);
  }
  updateTasks() {
    const t = this.shadowRoot.getElementById("task-list");
    if (!t) return;
    const e = o.getAllWindows();
    t.innerHTML = "", e.forEach((i) => {
      const s = document.createElement("button");
      s.className = "task-button", s.textContent = i.title, i.active && s.classList.add("active"), i.minimized && s.classList.add("minimized"), s.addEventListener("click", () => {
        i.minimized ? o.restore(i.id) : i.active ? o.minimize(i.id) : o.focus(i.id);
      }), t.appendChild(s);
    });
  }
  updateClock() {
    const t = this.shadowRoot.getElementById("clock");
    if (!t) return;
    const e = /* @__PURE__ */ new Date(), i = e.getHours(), s = e.getMinutes().toString().padStart(2, "0"), n = i >= 12 ? "PM" : "AM", a = i % 12 || 12;
    t.textContent = `${a}:${s} ${n}`;
  }
}
customElements.define("win98-taskbar", I);
export {
  E as Win98Button,
  S as Win98Desktop,
  z as Win98Select,
  I as Win98Taskbar,
  k as Win98Window,
  o as windowManager
};
