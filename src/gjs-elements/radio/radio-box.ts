import { DataType } from "dilswer";
import Gtk from "gi://Gtk";
import type { BaselinePosition, Orientation } from "../../g-enums";
import { diffProps } from "../../reconciler/diff-props";
import type { GjsElement } from "../gjs-element";
import type { TextNode } from "../markup/text-node";
import { ChildOrderController } from "../utils/element-extenders/child-order-controller";
import { ElementLifecycleController } from "../utils/element-extenders/element-lifecycle-controller";
import type { DiffedProps } from "../utils/element-extenders/map-properties";
import { PropertyMapper } from "../utils/element-extenders/map-properties";
import { ensureNotString } from "../utils/ensure-not-string";
import type { AlignmentProps } from "../utils/property-maps-factories/create-alignment-prop-mapper";
import { createAlignmentPropMapper } from "../utils/property-maps-factories/create-alignment-prop-mapper";
import type { MarginProps } from "../utils/property-maps-factories/create-margin-prop-mapper";
import { createMarginPropMapper } from "../utils/property-maps-factories/create-margin-prop-mapper";

type RadioBoxPropsMixin = AlignmentProps & MarginProps;

export interface RadioBoxProps extends RadioBoxPropsMixin {
  spacing?: number;
  baselinePosition?: BaselinePosition;
  orientation?: Orientation;
}

export class RadioBoxElement implements GjsElement<"RADIO_BOX", Gtk.Box> {
  readonly kind = "RADIO_BOX";
  widget = new Gtk.Box();
  radioGroup = new Gtk.RadioButton();

  private parent: GjsElement | null = null;

  private readonly lifecycle = new ElementLifecycleController();
  private readonly children = new ChildOrderController(
    this.lifecycle,
    this.widget
  );
  private readonly propsMapper = new PropertyMapper<RadioBoxProps>(
    this.lifecycle,
    createAlignmentPropMapper(this.widget),
    createMarginPropMapper(this.widget),
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

  constructor(props: any) {
    this.updateProps(props);

    this.lifecycle.emitLifecycleEventAfterCreate();
  }

  updateProps(props: DiffedProps): void {
    this.lifecycle.emitLifecycleEventUpdate(props);
  }

  // #region This widget direct mutations

  appendChild(child: GjsElement | TextNode): void {
    ensureNotString(child);

    child.notifyWillAppendTo(this);
    this.children.addChild(child);
    this.widget.show_all();
  }

  insertBefore(newChild: GjsElement | TextNode, beforeChild: GjsElement): void {
    ensureNotString(newChild);

    newChild.notifyWillAppendTo(this);
    this.children.insertBefore(newChild, beforeChild);
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

  notifyWillAppendTo(parent: GjsElement): void {
    this.parent = parent;
  }

  notifyWillUnmount(child: GjsElement): void {
    this.children.removeChild(child);
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
