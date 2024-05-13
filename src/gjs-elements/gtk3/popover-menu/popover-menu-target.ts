import type Gtk from "gi://Gtk";
import type { GjsContext } from "../../../reconciler/gjs-renderer";
import type { HostContext } from "../../../reconciler/host-context";
import { BaseElement, type GjsElement } from "../../gjs-element";
import { GjsElementManager } from "../../gjs-element-manager";
import type { DiffedProps } from "../../utils/element-extenders/map-properties";
import { ensureNotText } from "../../utils/ensure-not-string";
import { mountAction } from "../../utils/mount-action";
import { Bin } from "../../utils/widgets/bin";
import type { TextNode } from "../text-node";
import { PopoverMenuElement } from "./popover-menu";

export class PopoverMenuTargetElement extends BaseElement implements GjsElement<"POPOVER_MENU_TARGET", Gtk.Widget> {
  static getContext(
    currentContext: HostContext<GjsContext>,
  ): HostContext<GjsContext> {
    return currentContext;
  }

  readonly kind = "POPOVER_MENU_TARGET";
  protected emptyReplacement = new Bin();
  protected childElement: GjsElement | null = null;
  protected get widget(): Gtk.Widget {
    if (!this.childElement) {
      throw this.emptyReplacement;
    }
    return this.childElement.getWidget();
  }

  get doesOwnElement() {
    return this.childElement != null;
  }

  protected parent: PopoverMenuElement | null = null;

  protected readonly lifecycle = null;
  protected readonly handlers = null;
  protected readonly propsMapper = null;

  constructor(props: DiffedProps) {
    super();
    this.updateProps(props);
  }

  updateProps(props: DiffedProps): void {}

  // #region This widget direct mutations

  appendChild(child: GjsElement | TextNode): void {
    ensureNotText(child);

    if (this.childElement != null) {
      throw new Error("PopoverMenuTarget can only have one child.");
    } else {
      mountAction(this, child, () => {
        this.childElement = child;
        this.parent?.onTargetChange();
      });
    }
  }

  insertBefore(
    child: GjsElement | TextNode,
    beforeChild: GjsElement,
  ): void {
    throw new Error("PopoverMenuTarget can only have one child.");
  }

  remove(parent: GjsElement): void {
    parent.notifyChildWillUnmount(this);

    this.childElement = null;

    this.widget.destroy();

    this.parent?.onTargetChange();
  }

  render() {
    this.parent?.getWidget().show_all();
  }

  // #endregion

  // #region Element internal signals

  notifyWillMountTo(parent: GjsElement): boolean {
    if (
      !GjsElementManager.isGjsElementOfKind(
        parent,
        PopoverMenuElement,
      )
    ) {
      throw new Error(
        "PopoverContentElement can only be a child of PopoverElement",
      );
    }
    this.parent = parent;
    return true;
  }

  notifyMounted(): void {}

  notifyChildWillUnmount(child: GjsElement): void {
    this.childElement = null;
    this.parent?.onTargetChange();
  }

  // #endregion

  // #region Utils for external use

  show() {
    this.widget.visible = true;
  }

  hide() {
    this.widget.visible = false;
  }

  getWidget() {
    return this.widget;
  }

  getParentElement() {
    return this.parent;
  }

  addEventListener(
    signal: string,
    callback: Rg.GjsElementEventListenerCallback,
  ): void {}

  removeEventListener(
    signal: string,
    callback: Rg.GjsElementEventListenerCallback,
  ): void {}

  setProperty(key: string, value: any) {}

  getProperty(key: string) {}

  // #endregion
}
