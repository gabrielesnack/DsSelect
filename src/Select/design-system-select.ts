import { LitElement, css, html, unsafeCSS, svg } from 'lit'

import { customElement, property, state } from 'lit/decorators.js'
import {repeat} from 'lit/directives/repeat.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import ResetCss from '@unocss/reset/eric-meyer.css'
import { OptionsType } from './interface';
import { isItemChecked } from './helper';

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('design-system-select')
export class DesignSystemSelect extends LitElement {
  static styles = [
    unsafeCSS(ResetCss), 
    css`@unocss-placeholder;`, 
    // css`
    //   select {
    //     width: -webkit-fill-available;
    //   }
    // `
  ]

  @state()
  private isOpen = false;

  @state()
  private optionsChecked = [] as OptionsType[]

  @property({type: Boolean})
  isMulti = false;

  @property()
  public options = [
    { id: 1, value: '1', label: 'Option 1'},
    { id: 2, value: '2', label: 'Option 2'},
    { id: 3, value: '3', label: 'Option 3'},
    { id: 4, value: '4', label: 'Option 4'},
  ] as OptionsType[]

  private handleOpen() {
    this.isOpen = !this.isOpen;
    console.log('called')
  }

  private handleSingleOption(item: OptionsType) {
    this.isOpen = false;
    this.optionsChecked = [item]
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
      return svg`
      <li class="select-item select-item--selected" @click=${() => this.handleOption(item)}>
        Option 1
        <svg class="w-4" viewBox="0 0 512 512">
          <!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M470.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L192 338.7 425.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/>
        </svg>
      </li>
      `

    return html`<li class="select-item" @click=${() => this.handleOption(item)}>${item.label}</li>`
  }

  private dropdownTemplate() {
    return html`
      <ul class="select">
        ${repeat(this.options, (item) => item.id || item.value, this.dropdownItemTemplate.bind(this) )}
      </ul>
    `
  }

  private get shouldRenderDropdown() {
    return this.isOpen && !!this.options.length;
  }

  private get singleValue() {
    return !this.isMulti ? this.optionsChecked[0]?.label : '' 
  }


  connectedCallback(): void {
    super.connectedCallback();
    console.log(this.attachShadow)
  }

  render() {
    return html`
      <div class="position-relative">
        <input type="text" class="input input--normal" placeholder="Select" readonly value=${this.singleValue} @click=${this.handleOpen}></input>

        ${this.shouldRenderDropdown ? this.dropdownTemplate() : null}
      </div>
    `
  }

}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': DesignSystemSelect
  }
}
