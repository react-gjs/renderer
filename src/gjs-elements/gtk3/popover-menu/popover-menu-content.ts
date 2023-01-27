import { DataType } from "dilswer";
import Gtk from "gi://Gtk";
import type { BaselinePosition, Orientation } from "../../../g-enums";
import type { GjsContext } from "../../../reconciler/gjs-renderer";
import type { HostContext } from "../../../reconciler/host-context";
import type { GjsElement } from "../../gjs-element";
import { GjsElementManager } from "../../gjs-element-manager";
import { diffProps } from "../../utils/diff-props";
import { ChildOrderController } from "../../utils/element-extenders/child-order-controller";
import { ElementLifecycleController } from "../../utils/element-extenders/element-lifecycle-controller";
import type { DiffedProps } from "../../utils/element-extenders/map-properties";
import { PropertyMapper } from "../../utils/element-extenders/map-properties";
import { ensureNotText } from "../../utils/ensure-not-string";
import type { AlignmentProps } from "../../utils/property-maps-factories/create-alignment-prop-mapper";
import { createAlignmentPropMapper } from "../../utils/property-maps-factories/create-alignment-prop-mapper";
import type { ExpandProps } from "../../utils/property-maps-factories/create-expand-prop-mapper";
import { createExpandPropMapper } from "../../utils/property-maps-factories/create-expand-prop-mapper";
import type { MarginProps } from "../../utils/property-maps-factories/create-margin-prop-mapper";
import { createMarginPropMapper } from "../../utils/property-maps-factories/create-margin-prop-mapper";
import type { StyleProps } from "../../utils/property-maps-factories/create-style-prop-mapper";
import { createStylePropMapper } from "../../utils/property-maps-factories/create-style-prop-mapper";
import type { TextNode } from "../markup/text-node";
import { PopoverMenuEntryElement } from "./content-elements/popover-menu-entry";
import { PopoverMenuElement } from "./popover-menu";

type PopoverMenuContentPropsMixin = AlignmentProps &
  MarginProps &
  ExpandProps &
  StyleProps;

export interface PopoverMenuContentProps extends PopoverMenuContentPropsMixin {
  spacing?: number;
  baselinePosition?: BaselinePosition;
  orientation?: Orientation;
}

export class PopoverMenuContentElement
  implements GjsElement<"POPOVER_MENU_CONTENT", Gtk.Widget>
{
  static getContext(
    currentContext: HostContext<GjsContext>
  ): HostContext<GjsContext> {
    return currentContext;
  }

  readonly kind = "POPOVER_MENU_CONTENT";
  widget = new Gtk.Box();

  parentMenu: string | null = null;

  private parent: PopoverMenuElement | null = null;

  private readonly lifecycle = new ElementLifecycleController();
  private readonly children = new ChildOrderController<PopoverMenuEntryElement>(
    this.lifecycle,
    this.widget
  );
  private readonly propsMapper = new PropertyMapper<PopoverMenuContentProps>(
    this.lifecycle,
    createAlignmentPropMapper(this.widget),
    createMarginPropMapper(this.widget),
    createExpandPropMapper(this.widget),
    createStylePropMapper(this.widget),
    (props) =>
      props
        .spacing(DataType.Number, (v = 0) => {
          this.widget.spacing = v;
        })
        .baselinePosition(
          DataType.Enum(Gtk.BaselinePosition),
          (v = Gtk.BaselinePosition.TOP) => {
            this.widget.baseline_position = v;
          }
        )
        .orientation(
          DataType.Enum(Gtk.Orientation),
          (v = Gtk.Orientation.VERTICAL) => {
            this.widget.orientation = v;
          }
        )
  );

  constructor(props: DiffedProps) {
    this.updateProps(props);

    this.lifecycle.emitLifecycleEventAfterCreate();
  }

  getMenu() {
    return this.parent;
  }

  setParentMenu(name: string) {
    this.children.forEach((child) => {
      child.setParentMenu(name);
    });
  }

  updateProps(props: DiffedProps): void {
    this.lifecycle.emitLifecycleEventUpdate(props);
  }

  // #region This widget direct mutations

  appendChild(child: GjsElement | TextNode): void {
    ensureNotText(child);

    if (!GjsElementManager.isGjsElementOfKind(child, PopoverMenuEntryElement)) {
      throw new Error("Popover can only have PopoverEntry as children");
    }

    if (this.parentMenu) {
      child.setParentMenu(this.parentMenu);
    }

    const shouldAppend = child.notifyWillAppendTo(this);
    this.children.addChild(child, !shouldAppend);
    this.widget.show_all();
  }

  insertBefore(newChild: GjsElement | TextNode, beforeChild: GjsElement): void {
    ensureNotText(newChild);

    if (
      !GjsElementManager.isGjsElementOfKind(newChild, PopoverMenuEntryElement)
    ) {
      throw new Error("Popover can only have PopoverEntry as children");
    }

    const shouldAppend = newChild.notifyWillAppendTo(this);

    if (this.parentMenu) {
      newChild.setParentMenu(this.parentMenu);
    }

    this.children.insertBefore(newChild, beforeChild, !shouldAppend);
    this.widget.show_all();
  }

  remove(parent: GjsElement): void {
    parent.notifyWillUnmount(this);

    this.lifecycle.emitLifecycleEventBeforeDestroy();

    this.widget.destroy();
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
    this.children.removeChild(child);
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
