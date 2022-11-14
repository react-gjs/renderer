import { DataType } from "dilswer";
import Gtk from "gi://Gtk?version=3.0";
import type { GjsElement } from "../gjs-element";
import type { MarginProp } from "../utils/apply-margin";
import { applyMargin, MarginDataType } from "../utils/apply-margin";
import type { DiffedProps } from "../utils/map-properties";
import { createPropMap } from "../utils/map-properties";

export type BoxProps = {
  spacing?: number;
  baselinePosition?: Gtk.BaselinePosition;
  orientation?: Gtk.Orientation;
  margin?: MarginProp;
  verticalAlign?: Gtk.Align;
  horizontalAlign?: Gtk.Align;
};

export class BoxElement implements GjsElement<"BOX"> {
  readonly kind = "BOX";

  private widget = new Gtk.Box();
  private parent: Gtk.Container | null = null;

  private readonly mapProps = createPropMap<BoxProps>((props) =>
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
      .margin(MarginDataType, (v = 0) => {
        applyMargin(this.widget, v);
      })
      .verticalAlign(DataType.Enum(Gtk.Align), (v = Gtk.Align.START) => {
        this.widget.valign = v;
      })
      .horizontalAlign(DataType.Enum(Gtk.Align), (v = Gtk.Align.START) => {
        this.widget.halign = v;
      })
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
    this.widget.destroy();
  }

  updateProps(props: DiffedProps): void {
    this.mapProps(props);
  }

  render() {
    this.parent?.show_all();
  }
}
