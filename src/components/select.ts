import { LitElement, html, css, unsafeCSS } from 'lit';
import { property, state } from 'lit/decorators.js';
import win98Styles from '../css/98-overrides.css?inline';

interface OptionData {
  text: string;
  value: string;
  index: number;
}

class Win98Select extends LitElement {
  static formAssociated = true;

  @state()
  isOpen = false;

  @state()
  selectedIndex = -1;

  @state()
  options: OptionData[] = [];

  @property({ type: Boolean, reflect: true })
  disabled = false;

  private internals_: ElementInternals;

  static override styles = [
    css`${unsafeCSS(win98Styles)}`,
    css`
      :host {
        display: inline-block;
        font-family: "Pixelated MS Sans Serif", Arial, sans-serif;
        font-size: 11px;
        position: relative;
        width: 150px;
        outline: none;
      }

      :host(:focus) .select-box {
        outline: none;
      }

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
        padding: 2px 16px 2px 2px;
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
        margin-right: 2px;
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
        display: ${c => (c as Win98Select).isOpen ? 'block' : 'none'};
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
    `
  ];

  constructor() {
    super();
    this.internals_ = this.attachInternals();
  }

  override connectedCallback() {
    super.connectedCallback();
    this.updateOptions();

    document.addEventListener('click', this.handleDocumentClick);
    this.addEventListener('keydown', this.handleKeyDown);

    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0');
    }

    this.setAttribute('role', 'combobox');
    this.setAttribute('aria-haspopup', 'listbox');
    this.setAttribute('aria-expanded', 'false');
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this.handleDocumentClick);
    this.removeEventListener('keydown', this.handleKeyDown);
  }

  get form() {
    return this.internals_.form;
  }

  get name() {
    return this.getAttribute('name');
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
    return this.options[this.selectedIndex]?.value || '';
  }

  set value(v: string) {
    const index = this.options.findIndex(opt => opt.value === v);
    if (index !== -1) {
      this.select(index, false);
    }
  }

  formResetCallback() {
    if (this.options.length > 0) {
      this.select(0, false);
    }
  }

  formStateRestoreCallback(state: string) {
    this.value = state;
  }

  private handleDocumentClick = (e: MouseEvent) => {
    if (!this.contains(e.target as Node)) {
      this.close();
    }
  };

  private handleKeyDown = (e: KeyboardEvent) => {
    if (this.disabled) return;

    switch (e.key) {
      case ' ':
      case 'Enter':
        e.preventDefault();
        if (this.isOpen) {
          this.select(this.selectedIndex);
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
  };

  private moveSelection(step: number) {
    const newIndex = Math.max(0, Math.min(this.options.length - 1, this.selectedIndex + step));
    this.select(newIndex, false);
    this.scrollToOption(newIndex);
  }

  private scrollToOption(index: number) {
    const list = this.renderRoot.querySelector('.dropdown-list') as HTMLElement;
    const item = list.children[index] as HTMLElement;
    if (item) {
      item.scrollIntoView({ block: 'nearest' });
    }
  }

  private updateOptions() {
    const slot = this.renderRoot?.querySelector('slot') as HTMLSlotElement;
    const nodes = slot?.assignedNodes().filter(node => (node as Element).tagName === 'OPTION') || [];
    this.options = nodes.map((node, index) => ({
      text: (node as HTMLElement).textContent || '',
      value: (node as HTMLElement).getAttribute('value') || (node as HTMLElement).textContent || '',
      index
    }));

    if (this.options.length > 0 && this.selectedIndex === -1) {
      this.select(0, false);
    }
  }

  private toggle() {
    if (this.disabled) return;
    this.isOpen = !this.isOpen;
    this.setAttribute('aria-expanded', this.isOpen.toString());
    if (this.isOpen && this.selectedIndex !== -1) {
      setTimeout(() => this.scrollToOption(this.selectedIndex), 0);
    }
  }

  private close() {
    if (this.isOpen) {
      this.isOpen = false;
      this.setAttribute('aria-expanded', 'false');
    }
  }

  private select(index: number, close = true) {
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
    }
  }

  override updated(changedProperties: Map<string, unknown>) {
    super.updated(changedProperties);

    if (changedProperties.has('isOpen')) {
      const selectBox = this.renderRoot.querySelector('.select-box') as HTMLElement;
      if (selectBox) {
        selectBox.addEventListener('click', () => this.toggle());
      }

      const items = this.renderRoot.querySelectorAll('.dropdown-item') as NodeListOf<HTMLElement>;
      items.forEach(item => {
        item.addEventListener('mouseenter', () => {
          items.forEach(el => el.classList.remove('selected'));
          item.classList.add('selected');
        });

        item.addEventListener('click', (e) => {
          e.stopPropagation();
          this.select(parseInt((item as HTMLElement).dataset.index || '0'));
        });
      });
    }
  }

  override render() {
    const selectedOption = this.options[this.selectedIndex];
    const displayText = selectedOption ? selectedOption.text : '';

    return html`
      <div class="select-box" role="button" aria-haspopup="listbox" aria-expanded="${this.isOpen}">
        <span class="selected-value">${displayText}</span>
        <div class="select-arrow">
          <svg width="8" height="4" viewBox="0 0 8 4" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M0 0H8L4 4L0 0Z" fill="black"/>
          </svg>
        </div>
      </div>

      <div class="dropdown-list" role="listbox">
        ${this.options.map((opt, i) => html`
          <div class="dropdown-item ${i === this.selectedIndex ? 'selected' : ''}"
               role="option"
               aria-selected="${i === this.selectedIndex}"
               data-index="${i}">
            ${opt.text}
          </div>
        `)}
      </div>
      <slot style="display: none;"></slot>
    `;
  }
}

customElements.define('win98-select', Win98Select);

export default Win98Select;
