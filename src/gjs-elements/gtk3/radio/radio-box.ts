import { DataType } from "dilswer";
import Gtk from "gi://Gtk";
import type { BaselinePosition, Orientation } from "../../../g-enums";
import type { GjsContext } from "../../../reconciler/gjs-renderer";
import type { HostContext } from "../../../reconciler/host-context";
import type { GjsElement } from "../../gjs-element";
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

type RadioBoxPropsMixin = AlignmentProps &
  MarginProps &
  ExpandProps &
  StyleProps;

export interface RadioBoxProps extends RadioBoxPropsMixin {
  spacing?: number;
  baselinePosition?: BaselinePosition;
  orientation?: Orientation;
}

export class RadioBoxElement implements GjsElement<"RADIO_BOX", Gtk.Box> {
  static getContext(
    currentContext: HostContext<GjsContext>
  ): HostContext<GjsContext> {
    return currentContext;
  }

  readonly kind = "RADIO_BOX";
  widget = new Gtk.Box();
  radioGroup = new Gtk.RadioButton();

  private parent: GjsElement | null = null;

  readonly lifecycle = new ElementLifecycleController();
  private readonly children = new ChildOrderController(
    this.lifecycle,
    this.widget
  );
  private readonly propsMapper = new PropertyMapper<RadioBoxProps>(
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

  updateProps(props: DiffedProps): void {
    this.lifecycle.emitLifecycleEventUpdate(props);
  }

  // #region This widget direct mutations

  appendChild(child: GjsElement | TextNode): void {
    ensureNotText(child);

    const shouldAppend = child.notifyWillAppendTo(this);
    this.children.addChild(child, !shouldAppend);
    this.widget.show_all();
  }

  insertBefore(newChild: GjsElement | TextNode, beforeChild: GjsElement): void {
    ensureNotText(newChild);

    const shouldAppend = newChild.notifyWillAppendTo(this);
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
