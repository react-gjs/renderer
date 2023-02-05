import type Gtk from "gi://Gtk";
import type { GjsContext } from "../../../reconciler/gjs-renderer";
import type { HostContext } from "../../../reconciler/host-context";
import type { GjsElement } from "../../gjs-element";
import { GjsElementManager } from "../../gjs-element-manager";
import { diffProps } from "../../utils/diff-props";
import type { DiffedProps } from "../../utils/element-extenders/map-properties";
import { ensureNotText } from "../../utils/ensure-not-string";
import { Bin } from "../../utils/widgets/bin";
import type { TextNode } from "../markup/text-node";
import { PopoverMenuElement } from "./popover-menu";

export class PopoverMenuTargetElement
  implements GjsElement<"POPOVER_MENU_TARGET", Gtk.Widget>
{
  static getContext(
    currentContext: HostContext<GjsContext>
  ): HostContext<GjsContext> {
    return currentContext;
  }

  readonly kind = "POPOVER_MENU_TARGET";
  private emptyReplacement = new Bin();
  private childElement: GjsElement | null = null;
  get widget(): Gtk.Widget {
    if (!this.childElement) {
      throw this.emptyReplacement;
    }
    return this.childElement.widget;
  }

  get doesOwnElement() {
    return this.childElement != null;
  }

  private parent: PopoverMenuElement | null = null;

  constructor(props: DiffedProps) {
    this.updateProps(props);
  }

  updateProps(props: DiffedProps): void {}

  // #region This widget direct mutations

  appendChild(child: GjsElement | TextNode): void {
    ensureNotText(child);

    if (this.childElement != null) {
      throw new Error("PopoverMenuTarget can only have one child.");
    } else {
      const shouldAppend = child.notifyWillAppendTo(this);
      if (shouldAppend) {
        this.childElement = child;
        this.parent?.onTargetChange();
      }
    }
  }

  insertBefore(newChild: GjsElement | TextNode, beforeChild: GjsElement): void {
    throw new Error("PopoverMenuTarget can only have one child.");
  }

  remove(parent: GjsElement): void {
    parent.notifyWillUnmount(this);

    this.childElement = null;

    this.widget.destroy();

    this.parent?.onTargetChange();
  }

  render() {
    this.parent?.widget.show_all();
  }

  // #endregion

  // #region Element internal signals

  notifyWillAppendTo(parent: GjsElement): boolean {
    if (!GjsElementManager.isGjsElementOfKind(parent, PopoverMenuElement)) {
      throw new Error(
        "PopoverContentElement can only be a child of PopoverElement"
      );
    }
    this.parent = parent;
    return true;
  }

  notifyWillUnmount(child: GjsElement): void {
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

  diffProps(
    oldProps: Record<string, any>,
    newProps: Record<string, any>
  ): DiffedProps {
    return diffProps(oldProps, newProps, true);
  }

  // #endregion
}
