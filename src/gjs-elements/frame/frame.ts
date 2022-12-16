import { DataType } from "dilswer";
import Gtk from "gi://Gtk";
import { ShadowType } from "../../g-enums";
import type { GjsContext } from "../../reconciler/gjs-renderer";
import type { HostContext } from "../../reconciler/host-context";
import type { GjsElement } from "../gjs-element";
import type { TextNode } from "../markup/text-node";
import { diffProps } from "../utils/diff-props";
import { ChildOrderController } from "../utils/element-extenders/child-order-controller";
import { ElementLifecycleController } from "../utils/element-extenders/element-lifecycle-controller";
import type { DiffedProps } from "../utils/element-extenders/map-properties";
import { PropertyMapper } from "../utils/element-extenders/map-properties";
import { ensureNotText } from "../utils/ensure-not-string";
import type { AlignmentProps } from "../utils/property-maps-factories/create-alignment-prop-mapper";
import { createAlignmentPropMapper } from "../utils/property-maps-factories/create-alignment-prop-mapper";
import type { MarginProps } from "../utils/property-maps-factories/create-margin-prop-mapper";
import { createMarginPropMapper } from "../utils/property-maps-factories/create-margin-prop-mapper";
import type { StyleProps } from "../utils/property-maps-factories/create-style-prop-mapper";
import { createStylePropMapper } from "../utils/property-maps-factories/create-style-prop-mapper";

type FramePropsMixin = AlignmentProps & MarginProps & StyleProps;

export interface FrameProps extends FramePropsMixin {
  label?: string;
  labelAlignX?: number;
  labelAlignY?: number;
  shadowType?: ShadowType;
}

export class FrameElement implements GjsElement<"FRAME", Gtk.Frame> {
  static getContext(
    currentContext: HostContext<GjsContext>
  ): HostContext<GjsContext> {
    return currentContext;
  }

  readonly kind = "FRAME";
  widget = new Gtk.Frame();

  private parent: GjsElement | null = null;

  private readonly lifecycle = new ElementLifecycleController();
  private readonly children = new ChildOrderController(
    this.lifecycle,
    this.widget
  );
  private readonly propsMapper = new PropertyMapper<FrameProps>(
    this.lifecycle,
    createAlignmentPropMapper(this.widget),
    createMarginPropMapper(this.widget),
    createStylePropMapper(this.widget),
    (props) =>
      props
        .label(DataType.String, (v = "") => {
          this.widget.set_label(v);
        })
        .labelAlignX(DataType.Number, (v = 0, allProps) => {
          this.widget.set_label_align(v, allProps.labelAlignY ?? 0);
        })
        .labelAlignY(DataType.Number, (v = 0, allProps) => {
          this.widget.set_label_align(allProps.labelAlignX ?? 0, v);
        })
        .shadowType(DataType.Enum(ShadowType), (v = ShadowType.IN) => {
          this.widget.set_shadow_type(v);
        })
  );

  constructor(props: DiffedProps) {
    this.updateProps(props);

    this.lifecycle.emitLifecycleEventAfterCreate();
  }

  updateProps(props: DiffedProps): void {
    this.lifecycle.emitLifecycleEventUpdate(props);
  }

  // #region This widget direct mutations

  appendChild(child: GjsElement | TextNode): void {
    ensureNotText(child);

    if (this.children.count() > 0) {
      throw new Error("Expander can only have one child.");
    }

    child.notifyWillAppendTo(this);
    this.children.addChild(child);
    this.widget.show_all();
  }

  insertBefore(newChild: GjsElement | TextNode, beforeChild: GjsElement): void {
    throw new Error("Expander can only have one child.");
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

  notifyWillAppendTo(parent: GjsElement): void {
    this.parent = parent;
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
