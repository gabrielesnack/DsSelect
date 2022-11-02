
import { LitElement, css, html, unsafeCSS } from 'lit'
import {animate, fadeIn, fadeOut} from '@lit-labs/motion';
import { customElement, property, query } from 'lit/decorators.js'
import ResetCss from '@unocss/reset/eric-meyer.css'
import { classMap } from 'lit/directives/class-map.js';



@customElement('ds-menu')
export class DsMenu extends LitElement {
  static styles = [
    unsafeCSS(ResetCss), 
    css`@unocss-placeholder;`, 
    css`
      display: contents;
    `
  ]

  @property({ type: Boolean })
  isOpen = false;

  @property({ type: Boolean })
  isInverted = false;

  private get _renderClasses() {
    return classMap({
      "menu": true,
      "menu--dropdown": !this.isInverted,
      "menu--dropup": this.isInverted,
    })
  }

  render() {
    const keyframeOptions: KeyframeAnimationOptions = {
      duration: 600,
      fill: 'forwards'
    }

    if (!this.isOpen) return;

    return html`
      <ul class=${this._renderClasses} ${animate({
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
