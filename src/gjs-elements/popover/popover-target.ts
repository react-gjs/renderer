import Gtk from "gi://Gtk";
import type { BaselinePosition, Orientation } from "../../g-enums";
import { diffProps } from "../../reconciler/diff-props";
import type { GjsContext } from "../../reconciler/gjs-renderer";
import type { HostContext } from "../../reconciler/host-context";
import type { GjsElement } from "../gjs-element";
import { GjsElementManager } from "../gjs-element-manager";
import type { TextNode } from "../markup/text-node";
import type { DiffedProps } from "../utils/element-extenders/map-properties";
import { ensureNotString } from "../utils/ensure-not-string";
import type { AlignmentProps } from "../utils/property-maps-factories/create-alignment-prop-mapper";
import type { MarginProps } from "../utils/property-maps-factories/create-margin-prop-mapper";
import { PopoverElement } from "./popover";

type PopoverTargetPropsMixin = AlignmentProps & MarginProps;

export interface PopoverTargetProps extends PopoverTargetPropsMixin {
  spacing?: number;
  baselinePosition?: BaselinePosition;
  orientation?: Orientation;
}

export class PopoverTargetElement
  implements GjsElement<"POPOVER_TARGET", Gtk.Widget>
{
  static getContext(
    currentContext: HostContext<GjsContext>
  ): HostContext<GjsContext> {
    return currentContext;
  }

  readonly kind = "POPOVER_TARGET";
  private emptyReplacement = new Gtk.Box();
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

  private parent: PopoverElement | null = null;

  private hasContentChild = false;

  constructor(props: DiffedProps) {
    this.updateProps(props);
  }

  updateProps(props: DiffedProps): void {}

  // #region This widget direct mutations

  appendChild(child: GjsElement | TextNode): void {
    ensureNotString(child);

    if (this.childElement != null) {
      throw new Error("PopoverTarget can only have one child.");
    } else {
      child.notifyWillAppendTo(this);
      this.childElement = child;
      this.parent?.onTargetChange();
    }
  }

  insertBefore(newChild: GjsElement | TextNode, beforeChild: GjsElement): void {
    throw new Error("PopoverTarget can only have one child.");
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

  notifyWillAppendTo(parent: GjsElement): void {
    if (!GjsElementManager.isGjsElementOfKind(parent, PopoverElement)) {
      throw new Error(
        "PopoverContentElement can only be a child of PopoverElement"
      );
    }
    this.parent = parent;
  }

  notifyWillUnmount(child: GjsElement): void {
    this.childElement = null;
    this.parent?.onTargetChange();
  }

  // #endregion

  // #region Utils for external use

  diffProps(
    oldProps: Record<string, any>,
    newProps: Record<string, any>
  ): DiffedProps {
    return diffProps(oldProps, newProps, true);
  }

  // #endregion
}
