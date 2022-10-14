import { LitElement, css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('my-element')
export class MyElement extends LitElement {
  static styles = [css`@unocss-placeholder;`]

  render() {
    return html`
      <p class="text-3xl text-black font-bold">Ola Mundo</p>
    `
  }

}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement
  }
}
