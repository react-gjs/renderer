import { DataType } from "dilswer";
import Gtk from "gi://Gtk?version=3.0";
import type { BaselinePosition, Orientation } from "../../g-enums";
import type { GjsElement } from "../gjs-element";
import type { DiffedProps } from "../utils/map-properties";
import { createPropMap } from "../utils/map-properties";
import type { AlignmentProps } from "../utils/property-maps-factories/create-alignment-prop-mapper";
import { createAlignmentPropMapper } from "../utils/property-maps-factories/create-alignment-prop-mapper";
import type { MarginProps } from "../utils/property-maps-factories/create-margin-prop-mapper";
import { createMarginPropMapper } from "../utils/property-maps-factories/create-margin-prop-mapper";

type BoxPropsMixin = AlignmentProps & MarginProps;

export interface BoxProps extends BoxPropsMixin {
  spacing?: number;
  baselinePosition?: BaselinePosition;
  orientation?: Orientation;
}

export class BoxElement implements GjsElement<"BOX"> {
  readonly kind = "BOX";

  private parent: Gtk.Container | null = null;
  widget = new Gtk.Box();

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
          (v = Gtk.Orientation.HORIZONTAL) => {
            this.widget.orientation = v;
          }
        )
  );

  constructor(props: any) {
    this.updateProps(props);
  }

  appendTo(parent: Gtk.Container): void {
    parent.add(this.widget);
    this.parent = parent;
  }

  appendChild(child: GjsElement<any> | string): void {
    if (typeof child === "string") {
      throw new Error("Box can only have other elements as it's children.");
    } else {
      child.appendTo(this.widget);
      this.widget.show_all();
    }
  }

  remove(parent: GjsElement<any>): void {
    this.propsMapper.cleanupAll();
    this.widget.destroy();
  }

  updateProps(props: DiffedProps): void {
    this.propsMapper.update(props);
  }

  render() {
    this.parent?.show_all();
  }
}
