
import { LitElement, css, html, unsafeCSS, svg } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { cache } from 'lit/directives/cache.js';
import ResetCss from '@unocss/reset/eric-meyer.css'

const checkedIconTemplate = cache(svg`
  <svg class="w-4" viewBox="0 0 512 512">
  <!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M470.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L192 338.7 425.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/>
  </svg>
`)

@customElement('ds-select-item')
export class DsSelectItem extends LitElement {
  static styles = [
    unsafeCSS(ResetCss), 
    css`@unocss-placeholder;`, 
    css`
      select {
        width: -webkit-fill-available;
      }
    `
  ]

  @property({ type: Boolean  })
  public isSelected = false; 

  private _onClick() {
    this.dispatchEvent(new CustomEvent('dsSelectItemClick', {
      bubbles: true,
      composed: true 
    }))
  }

  private get dropdownItemTemplate() {
    if (this.isSelected)
      return html`
      <li class="select-item select-item--selected" @click=${this._onClick}>
        <slot></slot>
        ${checkedIconTemplate}
      </li>
      `

    return html`<li class="select-item" @click=${this._onClick}><slot></slot></li>`
  }

  render() {
    return html`
      ${this.dropdownItemTemplate}
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-select-item': DsSelectItem
  }
}
