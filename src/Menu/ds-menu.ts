
import { LitElement, css, html, unsafeCSS } from 'lit'
import {animate, fadeIn, fadeOut} from '@lit-labs/motion';
import { customElement, property } from 'lit/decorators.js'
import ResetCss from '@unocss/reset/eric-meyer.css'

@customElement('ds-menu')
export class DsMenu extends LitElement {
  static styles = [
    unsafeCSS(ResetCss), 
    css`@unocss-placeholder;`, 
    css`
      select {
        width: -webkit-fill-available;
      }
    `
  ]

  @property({ type: Boolean })
  isOpen = false;

  render() {
    const keyframeOptions: KeyframeAnimationOptions = {
      duration: 600,
      fill: 'forwards'
    }

    if (!this.isOpen) return;

    return html`
      <ul class="menu" ${animate({
        keyframeOptions,
        in: fadeIn,
        out: fadeOut,
      })}>
        <slot></slot>
      </ul>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-menu': DsMenu
  }
}
