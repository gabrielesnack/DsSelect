import { LitElement, css, html, unsafeCSS, svg } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { cache } from 'lit/directives/cache.js';
import ResetCss from '@unocss/reset/eric-meyer.css'

const timesIconTemplate = cache(svg`
  <svg viewBox="0 0 512 512" class="w-4 fill-gray-400 cursor-pointer">
    <!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/>
  </svg>
`)

@customElement('ds-tag')
export class DsTag extends LitElement {
  static styles = [
    unsafeCSS(ResetCss), 
    css`
      @unocss-placeholder;
    `, 

    css`
      :host([is-truncate]) slot {
        display: inline-block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    `
  ]

  @property({ type: Boolean, attribute: 'is-closable' })
  isClosable = false

  @property({ type: Boolean, attribute: 'is-truncate' })
  isTruncate = false

  private _onRemove(e: Event) {
    e.stopImmediatePropagation();
    this.dispatchEvent(new CustomEvent('dsTagRemove', {
      bubbles: true,
      composed: true 
    }));
  }

  private get _closableIcon() {
    if (!this.isClosable) return;

    return html`
      <span class="flex items-center" @click=${this._onRemove}>
        ${timesIconTemplate}
      </span>
    `
  }

  render() {
    return html`
      <span class="tag">
        <slot></slot>
        ${this._closableIcon}
      </span>
    `
  }

}

declare global {
  interface HTMLElementTagNameMap {
    'ds-tag': DsTag
  }
}
