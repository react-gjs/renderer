import Gtk from "gi://Gtk";
import type { GjsContext } from "../../../reconciler/gjs-renderer";
import type { HostContext } from "../../../reconciler/host-context";
import { BaseElement, type GjsElement } from "../../gjs-element";
import { GjsElementManager } from "../../gjs-element-manager";
import type { DiffedProps } from "../../utils/element-extenders/map-properties";
import { ensureNotText } from "../../utils/ensure-not-string";
import { mountAction } from "../../utils/mount-action";
import type { TextNode } from "../text-node";
import { PopoverElement } from "./popover";

export class PopoverContentElement
  extends BaseElement
  implements GjsElement<"POPOVER_CONTENT", Gtk.Widget>
{
  static getContext(
    currentContext: HostContext<GjsContext>,
  ): HostContext<GjsContext> {
    return currentContext;
  }

  readonly kind = "POPOVER_CONTENT";
  protected emptyReplacement = new Gtk.Box();
  protected childElement: GjsElement | null = null;
  protected get widget(): Gtk.Widget {
    if (!this.childElement) {
      throw this.emptyReplacement;
    }
    return this.childElement.getWidget();
  }

  protected parent: PopoverElement | null = null;

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
      throw new Error("PopoverContent can only have one child.");
    } else {
      mountAction(this, child, (shouldOmitMount) => {
        this.childElement = child;
        this.parent?.onContentChange();
      });
    }
  }

  insertBefore(
    newChild: GjsElement | TextNode,
    beforeChild: GjsElement,
  ): void {
    throw new Error("PopoverContent can only have one child.");
  }

  remove(parent: GjsElement): void {
    parent.notifyChildWillUnmount(this);

    this.childElement = null;

    this.widget.destroy();

    this.parent?.onContentChange();
  }

  render() {
    this.parent?.getWidget().show_all();
  }

  // #endregion

  // #region Element internal signals

  notifyWillMountTo(parent: GjsElement): boolean {
    if (
      !GjsElementManager.isGjsElementOfKind(parent, PopoverElement)
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
    this.parent?.onContentChange();
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
