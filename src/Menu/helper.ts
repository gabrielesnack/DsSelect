import { PropertyPart, ReactiveController, ReactiveControllerHost } from "lit";
import {  Directive, directive, DirectiveParameters, PartInfo, PartType } from "lit/async-directive.js";
import { debounce } from "../Utils";

export class MenuDirective extends Directive  {
  constructor(part: PartInfo) {
    super(part)
    if(part.type !== PartType.ELEMENT) throw ('it should place on an element e.g <ds-menu ${this.menuController.observer()}></ds-menu>')
  }

  update(part: PropertyPart, [controller]: DirectiveParameters<this>) {
    if(!controller.element) controller.element = part.element;

    return this.render(controller)
  }

  render(_controller: MenuController) {
    return false;
  }

}

const menuDirective = directive(MenuDirective)

export class MenuController implements ReactiveController {
  private _host: ReactiveControllerHost;
  element: HTMLElement | undefined
  isInverted = false; 

  constructor(host: ReactiveControllerHost) {
    (this._host = host).addController(this);
  }

  public observe() {
    return menuDirective(this)
  }

  private _handlePlacement = () => {
  
    if (!this.element) return;

    const windowSize = window.innerHeight;
    const menuPosition = this.element.parentElement?.getBoundingClientRect().bottom

    if (!menuPosition) return;
    
    const shouldInversePlacement = menuPosition + 200 >= windowSize;

    const updateClasses = () => {
      if (shouldInversePlacement) {
        this.isInverted = true;
        this._host.requestUpdate();

        return;
      }

      this.isInverted = false;
      this._host.requestUpdate();
    }

    debounce(updateClasses, 100)()
  }

  hostConnected() {
    window.addEventListener("scroll", this._handlePlacement);
  }
  hostDisconnected() {
    window.removeEventListener("scroll", this._handlePlacement);
  }
}

