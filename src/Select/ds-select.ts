import { LitElement, css, html, unsafeCSS, svg, PropertyValueMap } from 'lit'
import {animate, fadeIn, fadeInSlow, fadeOut, flyAbove, flyBelow} from '@lit-labs/motion';
import { customElement, property, state } from 'lit/decorators.js'
import { cache } from 'lit/directives/cache.js';
import {repeat} from 'lit/directives/repeat.js';
import {ifDefined} from 'lit/directives/if-defined.js';
import ResetCss from '@unocss/reset/eric-meyer.css'
import { HTMLElementEvent, OptionsType } from './interface';
import { filterByLabel, isChecked, isOptionChecked, sliceLabel, sortByItemsChecked } from './helper';


const chevronIconTemplate = cache(svg`
<svg class="peer-focus:-rotate-180 transition-all transition-duration-200 fill-gray-400 w-3 position-absolute right-3 top-4" viewBox="0 0 512 512">
 <!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/>
</svg>
`)

@customElement('ds-select')
export class DsSelect extends LitElement {
  static styles = [
    unsafeCSS(ResetCss), 
    css`@unocss-placeholder;`, 
    css`
      select {
        width: -webkit-fill-available;
      }
    `
  ]

  constructor() {
    super()
    this._computedOptions = this.options;
  }

  @property()
  placeholder: string = 'Escolha uma fruta'

  @property()
  placeholderSearchable: string = 'Digite a opção desejada'

  @property({type: Boolean, attribute: 'is-multi'})
  isMulti = false;

  @property({ type: Boolean, attribute: 'is-filterable'})
  isFilterable: true | undefined = undefined;

  @property()
  options = [
    { id: 1, value: '1', label: 'Banana com cauda de chocolate'},
    { id: 2, value: '2', label: 'Ana'},
    { id: 3, value: '3', label: 'Maça'},
    { id: 4, value: '4', label: 'Laranja'},
  ] as OptionsType[]

  @state()
  private _isOpen = false;

  private get isOpen() {
    return this._isOpen
  }

  private set isOpen(value: boolean) {
    this.shouldHideValueOnFiltering(value);
    this._isOpen = value;
  }

  @state()
  private optionsChecked = [] as OptionsType[]

  @state()
  private value : string | null | number = null;

  @state()
  private _computedOptions: OptionsType[] = []
  private get computedOptions() { return this._computedOptions; }
  private set computedOptions(value) {
    const sortedValue = sortByItemsChecked(value, this.optionsChecked)
    this._computedOptions = sortedValue;
  }

  // events
  private _onChange(evt: HTMLElementEvent<HTMLInputElement> ) {
    if (this.isMulti) return;

    if (this.optionsChecked.length) {
      this.value = this.optionsChecked[0].label.toString();
      evt.target.value = this.value;

      return;
    }
    
    evt.target.value = '';
  }

  private _onInput(evt: HTMLElementEvent<HTMLInputElement>) {
    // define debounce
    const value = evt.target.value;
    this.computedOptions = filterByLabel(value, this.options)
  }

  private _onClick() {
    this.isOpen = !this.isOpen;
  }

  private handleSingleOption(item: OptionsType) {
    this.isOpen = false;
    this.optionsChecked = [item]
    this.value = item.label.toString();
  }

  private handleMultiOption(item: OptionsType) {
    const foundIndex = this.optionsChecked.findIndex(option => isChecked(option, item))

    if (foundIndex !== -1) {
      this.optionsChecked = this.optionsChecked.filter((_, idx) => idx !== foundIndex)
      return;
    }

    this.optionsChecked = [...this.optionsChecked, item];
  }

  private selectOption(item: OptionsType) : void {
    if (!this.isMulti) return this.handleSingleOption(item);

    this.handleMultiOption(item)
  }

  private _onRemoveTag() {
    this.optionsChecked.shift()
    this.requestUpdate('optionsChecked')
  }

  private get shouldRenderPlaceholder() {
    if(this.isOpen && this.isFilterable) return this.placeholderSearchable

    return !this.optionsChecked.length ? this.placeholder : ''
  }

  private shouldHideValueOnFiltering(isDropdownOpened: boolean) {
    if (this.isMulti) return;

    if (isDropdownOpened) {
      this.value = '';
      this.computedOptions = this.options;
      return;
    }
    
    this.value = this.optionsChecked[0]?.label
  }

  private get shouldRenderDropdown() {
    return this.isOpen && !!this.options.length;
  }

  private get renderTagsTemplate() {
    if (!this.isMulti) return;
    if (!this.optionsChecked.length) return;
    if (this.isOpen && this.isFilterable) return;

    const hasMoreThanOne = this.optionsChecked.length > 1

    return html`
      <div class="position-absolute top-2.3 left-2 flex gap-2 w-full">
        <ds-tag is-closable is-truncate class="max-w-2/4" @dsTagRemove=${this._onRemoveTag}>${this.optionsChecked[0].label}</ds-tag>
        ${hasMoreThanOne ? html`<ds-tag>+${this.optionsChecked.length - 1}</ds-tag>`: ''}
      </div>
    `
  }

  private get renderOptionsTemplate() {
    return repeat(this.computedOptions, (item) => item?.id || item?.value, (option) => {
      const isSelected = isOptionChecked(option, this.optionsChecked) || undefined 

      return html`
        <ds-select-item 
          .isSelected="${isSelected}"
          @dsSelectItemClick=${() => this.selectOption(option)}
        >
          ${option?.label}
        </ds-select-item>
    `})
  }

  render() {
    return html`
      <div class="position-relative">
        <input 
          type="text" 
          class="input input--normal peer" 
          placeholder=${ifDefined(this.shouldRenderPlaceholder)} 
          readonly=${ifDefined(!this.isFilterable || undefined)} 
          .value="${this.value}"
          @click=${this._onClick} 
          @input=${this._onInput}
          @change=${this._onChange}
        />
        ${chevronIconTemplate}

        ${this.renderTagsTemplate}

        <ds-menu .isOpen=${this.shouldRenderDropdown}>
          ${this.renderOptionsTemplate}
        </ds-menu>
      </div>
    `
  }

}

declare global {
  interface HTMLElementTagNameMap {
    'ds-select': DsSelect
  }
}
