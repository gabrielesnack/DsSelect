import { LitElement, css, html, unsafeCSS, svg, PropertyValueMap } from 'lit'
import {animate, fadeIn, fadeInSlow, fadeOut, flyAbove, flyBelow} from '@lit-labs/motion';
import { customElement, property, state } from 'lit/decorators.js'
import { cache } from 'lit/directives/cache.js';
import {repeat} from 'lit/directives/repeat.js';
import {ifDefined} from 'lit/directives/if-defined.js';
import ResetCss from '@unocss/reset/eric-meyer.css'
import { HTMLElementEvent, OptionsType } from './interface';
import { filterByLabel, isItemChecked, sortByItemsChecked } from './helper';


const chevronIconTemplate = cache(svg`
<svg class="peer-focus:-rotate-180 transition-all transition-duration-200 fill-gray-400 w-3 position-absolute right-3 top-4" viewBox="0 0 512 512">
 <!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/>
</svg>
`)

const checkedIconTemplate = cache(svg`
<svg class="w-4" viewBox="0 0 512 512">
<!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M470.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L192 338.7 425.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/>
</svg>
`)

const timesIconTemplate = cache(svg`
<svg viewBox="0 0 512 512" class="w-4 fill-gray-400 cursor-pointer">
  <!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/>
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

  @property({type: Boolean})
  isMulti = false;

  @property({ type: Boolean, attribute: 'is-filterable'})
  isFilterable: true | undefined = undefined;

  @property()
  public options = [
    { id: 1, value: '1', label: 'Banana'},
    { id: 2, value: '2', label: 'Ana'},
    { id: 3, value: '3', label: 'Maça'},
    { id: 4, value: '4', label: 'Laranja'},
  ] as OptionsType[]

  @state()
  private isOpen = false;

  @state()
  private optionsChecked = [] as OptionsType[]

  @state()
  private value : string | null = null;

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
    const foundIndex = this.optionsChecked.findIndex(option => isItemChecked(option, item))

    if (foundIndex !== -1) {
      this.optionsChecked = this.optionsChecked.filter((_, idx) => idx !== foundIndex)
      return;
    }

    this.optionsChecked = [...this.optionsChecked, item];
  }

  private handleOption(item: OptionsType) : void {
    if (!this.isMulti) return this.handleSingleOption(item);

    this.handleMultiOption(item)
  }

  private dropdownItemTemplate(item: OptionsType) {
    const isSelected = this.optionsChecked.length && this.optionsChecked.find(option => isItemChecked(option, item));
    if (!!isSelected)
      return html`
      <li class="select-item select-item--selected" @click=${() => this.handleOption(item)}>
        ${item.label}
        ${checkedIconTemplate}
      </li>
      `

    return html`<li class="select-item" @click=${() => this.handleOption(item)}>${item.label}</li>`
  }

  private dropdownTemplate() {
    const keyframeOptions: KeyframeAnimationOptions = {
      duration: 600,
      fill: 'forwards'
    }

    return html`
      <ul class="select" ${animate({
        keyframeOptions,
        in: fadeIn,
        out: fadeOut,
      })}>
        ${repeat(this.computedOptions, (item) => item.id || item.value, this.dropdownItemTemplate.bind(this) )}
      </ul>
    `
  }

  private _onRemoveTag() {
    this.optionsChecked.shift()
    this.requestUpdate('optionsChecked')
  }

  private get tagsTemplate() {
    if (!this.isMulti) return;
    if (!this.optionsChecked.length) return;

    const hasMoreThanOne = this.optionsChecked.length > 1

    return html`
      <div class="position-absolute top-2.3 left-2 flex gap-2">
        <ds-tag is-closable @dsTagRemove=${this._onRemoveTag}>${this.optionsChecked[0].label}</ds-tag>
        ${hasMoreThanOne ? html`<ds-tag>+${this.optionsChecked.length - 1}</ds-tag>`: ''}
      </div>
    `
  }

  private get shouldRenderDropdown() {
    return this.isOpen && !!this.options.length;
  }

  render() {
    return html`
      <div class="position-relative">
        <input 
          type="text" 
          class="input input--normal peer" placeholder="Select" 
          readonly=${ifDefined(this.isFilterable)} 
          .value="${this.value}"
          @click=${this._onClick} 
          @input=${this._onInput}
          @change=${this._onChange}
        />
        ${chevronIconTemplate}
        ${this.tagsTemplate}


        ${this.shouldRenderDropdown ? this.dropdownTemplate() : null}
      </div>
    `
  }

}

declare global {
  interface HTMLElementTagNameMap {
    'ds-select': DsSelect
  }
}
