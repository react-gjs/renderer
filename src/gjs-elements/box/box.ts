import { DataType } from "dilswer";
import Gtk from "gi://Gtk";
import type { BaselinePosition, Orientation } from "../../g-enums";
import type { GjsElement } from "../gjs-element";
import { ensureNotString } from "../utils/ensure-not-string";
import type { DiffedProps } from "../utils/map-properties";
import { createPropMap } from "../utils/map-properties";
import type { AlignmentProps } from "../utils/property-maps-factories/create-alignment-prop-mapper";
import { createAlignmentPropMapper } from "../utils/property-maps-factories/create-alignment-prop-mapper";
import type { MarginProps } from "../utils/property-maps-factories/create-margin-prop-mapper";
import { createMarginPropMapper } from "../utils/property-maps-factories/create-margin-prop-mapper";
import { ChildOrderController } from "../utils/widget-operations/child-order-controller";

type BoxPropsMixin = AlignmentProps & MarginProps;

export interface BoxProps extends BoxPropsMixin {
  spacing?: number;
  baselinePosition?: BaselinePosition;
  orientation?: Orientation;
}

export class BoxElement implements GjsElement<"BOX", Gtk.Box> {
  readonly kind = "BOX";

  private parent: GjsElement | null = null;
  widget = new Gtk.Box();
  private children = new ChildOrderController(Gtk.Box, this.widget);

  private readonly propsMapper = createPropMap<BoxProps>(
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
  }

  notifyWillAppendTo(parent: GjsElement): void {
    this.parent = parent;
  }

  appendChild(child: GjsElement | string): void {
    ensureNotString(child);

    child.notifyWillAppendTo(this);
    this.children.addChild(child);
    this.widget.show_all();
  }

  notifyWillUnmount(child: GjsElement): void {
    this.children.removeChild(child);
  }

  remove(parent: GjsElement): void {
    parent.notifyWillUnmount(this);

    this.propsMapper.cleanupAll();
    this.widget.destroy();
  }

  updateProps(props: DiffedProps): void {
    this.propsMapper.update(props);
  }

  render() {
    this.parent?.widget.show_all();
  }

  insertBefore(newChild: GjsElement | string, beforeChild: GjsElement): void {
    ensureNotString(newChild);

    newChild.notifyWillAppendTo(this);
    this.children.insertBefore(newChild, beforeChild);
    this.widget.show_all();
  }
}
