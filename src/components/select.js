import win98Styles from '98.css?inline';

class Win98Select extends HTMLElement {
    static get formAssociated() {
        return true;
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.internals_ = this.attachInternals();
        this.isOpen = false;
        this.selectedIndex = -1;
        this.options = [];

        // Bind methods
        this.handleDocumentClick = this.handleDocumentClick.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    connectedCallback() {
        this.render();
        this.updateOptions();

        // Observer for slot changes
        this.shadowRoot.querySelector('slot').addEventListener('slotchange', () => {
            this.updateOptions();
            this.render();
        });

        // Event listeners
        document.addEventListener('click', this.handleDocumentClick);
        this.addEventListener('keydown', this.handleKeyDown);

        if (!this.hasAttribute('tabindex')) {
            this.setAttribute('tabindex', '0');
        }

        this.setAttribute('role', 'combobox');
        this.setAttribute('aria-haspopup', 'listbox');
        this.setAttribute('aria-expanded', 'false');
    }

    disconnectedCallback() {
        document.removeEventListener('click', this.handleDocumentClick);
        this.removeEventListener('keydown', this.handleKeyDown);
    }

    // Form Associated API
    get form() { return this.internals_.form; }
    get name() { return this.getAttribute('name'); }
    get type() { return this.localName; }
    get validity() { return this.internals_.validity; }
    get validationMessage() { return this.internals_.validationMessage; }
    get willValidate() { return this.internals_.willValidate; }

    checkValidity() { return this.internals_.checkValidity(); }
    reportValidity() { return this.internals_.reportValidity(); }

    get value() {
        return this.options[this.selectedIndex]?.value || '';
    }

    set value(v) {
        const index = this.options.findIndex(opt => opt.value === v);
        if (index !== -1) {
            this.select(index, false);
        }
    }

    formResetCallback() {
        // Reset to first option or specific logic
        if (this.options.length > 0) {
            this.select(0, false);
        }
    }

    formStateRestoreCallback(state, mode) {
        this.value = state;
    }

    handleDocumentClick(e) {
        if (!this.contains(e.target)) {
            this.close();
        }
    }

    handleKeyDown(e) {
        if (this.hasAttribute('disabled')) return;

        switch (e.key) {
            case ' ':
            case 'Enter':
                e.preventDefault();
                if (this.isOpen) {
                    this.select(this.selectedIndex); // Confirm selection
                } else {
                    this.toggle();
                }
                break;
            case 'Escape':
                if (this.isOpen) {
                    e.preventDefault();
                    this.close();
                }
                break;
            case 'ArrowDown':
                e.preventDefault();
                if (!this.isOpen) {
                    this.toggle();
                } else {
                    this.moveSelection(1);
                }
                break;
            case 'ArrowUp':
                e.preventDefault();
                if (!this.isOpen) {
                    this.toggle();
                } else {
                    this.moveSelection(-1);
                }
                break;
            case 'Home':
                e.preventDefault();
                if (this.isOpen) this.select(0, false);
                break;
            case 'End':
                e.preventDefault();
                if (this.isOpen) this.select(this.options.length - 1, false);
                break;
        }
    }

    moveSelection(step) {
        const newIndex = Math.max(0, Math.min(this.options.length - 1, this.selectedIndex + step));
        this.select(newIndex, false); // Don't close, just highlight
        this.scrollToOption(newIndex);
    }

    scrollToOption(index) {
        const list = this.shadowRoot.querySelector('.dropdown-list');
        const item = list.children[index];
        if (item) {
            item.scrollIntoView({ block: 'nearest' });
        }
    }

    updateOptions() {
        const slot = this.shadowRoot.querySelector('slot');
        const nodes = slot.assignedNodes().filter(node => node.tagName === 'OPTION');
        this.options = nodes.map((node, index) => ({
            text: node.textContent,
            value: node.getAttribute('value') || node.textContent,
            index
        }));

        // Set initial selection if needed
        if (this.options.length > 0 && this.selectedIndex === -1) {
            this.select(0, false);
        }
    }

    toggle() {
        if (this.hasAttribute('disabled')) return;
        this.isOpen = !this.isOpen;
        this.setAttribute('aria-expanded', this.isOpen);
        this.render();
        if (this.isOpen && this.selectedIndex !== -1) {
            // Wait for render
            setTimeout(() => this.scrollToOption(this.selectedIndex), 0);
        }
    }

    close() {
        if (this.isOpen) {
            this.isOpen = false;
            this.setAttribute('aria-expanded', 'false');
            this.render();
        }
    }

    select(index, close = true) {
        if (index < 0 || index >= this.options.length) return;

        this.selectedIndex = index;
        this.internals_.setFormValue(this.value);

        if (close) {
            this.close();
            this.dispatchEvent(new CustomEvent('change', {
                bubbles: true,
                composed: true,
                detail: {
                    value: this.options[index].value,
                    index: index
                }
            }));
        } else {
            this.render();
        }
    }

    render() {
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(win98Styles);
        this.shadowRoot.adoptedStyleSheets = [sheet];

        const selectedOption = this.options[this.selectedIndex];
        const displayText = selectedOption ? selectedOption.text : '';

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
          display: ${this.isOpen ? 'block' : 'none'};
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
        <span class="selected-value">${displayText}</span>
        <div class="select-arrow">
            <svg width="8" height="4" viewBox="0 0 8 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M0 0H8L4 4L0 0Z" fill="black"/>
            </svg>
        </div>
      </div>
      
      <div class="dropdown-list" role="listbox">
        ${this.options.map((opt, i) => `
          <div class="dropdown-item ${i === this.selectedIndex ? 'selected' : ''}" 
               role="option" 
               aria-selected="${i === this.selectedIndex}"
               data-index="${i}">
            ${opt.text}
          </div>
        `).join('')}
      </div>
      <slot style="display: none;"></slot>
    `;

        this.shadowRoot.querySelector('.select-box').addEventListener('click', () => this.toggle());

        this.shadowRoot.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('mouseenter', () => {
                // Visual highlight only on hover
                this.shadowRoot.querySelectorAll('.dropdown-item').forEach(el => el.classList.remove('selected'));
                item.classList.add('selected');
            });

            item.addEventListener('click', (e) => {
                e.stopPropagation();
                this.select(parseInt(item.dataset.index));
            });
        });
    }
}

customElements.define('win98-select', Win98Select);

export default Win98Select;
