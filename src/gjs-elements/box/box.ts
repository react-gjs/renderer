import { DataType } from "dilswer";
import Gtk from "gi://Gtk?version=3.0";
import type { GjsElement } from "../gjs-element";
import { mapProperties } from "../utils/map-properties";

export type BoxProps = {
  spacing?: number;
  baselinePosition?: Gtk.BaselinePosition;
  orientation?: Gtk.Orientation;
};

export class BoxElement implements GjsElement {
  readonly kind = "BOX";

  private gobject = new Gtk.Box();
  private parent: Gtk.Container | null = null;

  constructor(props: any) {
    this.updateProps(props);
  }

  appendTo(parent: Gtk.Container): void {
    parent.add(this.gobject);
    this.parent = parent;
  }

  appendChild(child: GjsElement | string): void {
    if (typeof child === "string") {
      throw new Error("Box can only have other elements as it's children.");
    } else {
      child.appendTo(this.gobject);
      this.gobject.show_all();
    }
  }

  remove(parent: GjsElement): void {
    this.gobject.destroy();
  }

  updateProps(props: any): void {
    mapProperties<BoxProps>(props)
      .spacing(DataType.Number, (v) => (this.gobject.spacing = v))
      .baselinePosition(
        DataType.Enum(Gtk.BaselinePosition),
        (v) => (this.gobject.baseline_position = v)
      )
      .orientation(
        DataType.Enum(Gtk.Orientation),
        (v) => (this.gobject.orientation = v)
      );
  }

  render() {
    this.parent?.show_all();
  }
}
