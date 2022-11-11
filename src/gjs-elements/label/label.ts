import { DataType } from "dilswer";
import Gtk from "gi://Gtk?version=3.0";
import Pango from "gi://Pango";
import type { GjsElement } from "../gjs-element";
import { mapProperties } from "../utils/map-properties";

export type LabelProps = {
  wrap?: boolean;
  wrapMode?: Pango.WrapMode;
  ellipsize?: Pango.EllipsizeMode;
  justify?: Gtk.Justification;
  lines?: number;
  selectable?: boolean;
  children?: string;
};

export class LabelElement implements GjsElement {
  readonly kind = "LABEL";

  private gobject = new Gtk.Label();
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
      this.gobject.set_text(child);
    } else {
      throw new TypeError("Label can only have text as it's children.");
    }
  }

  remove(parent: GjsElement): void {
    this.gobject.destroy();
  }

  updateProps(props: any): void {
    mapProperties<LabelProps>(props)
      .wrap(DataType.Boolean, (v) => (this.gobject.wrap = v))
      .selectable(DataType.Boolean, (v) => (this.gobject.selectable = v))
      .lines(DataType.Number, (v) => (this.gobject.lines = v))
      .ellipsize(
        DataType.Enum(Pango.EllipsizeMode),
        (v) => (this.gobject.ellipsize = v)
      )
      .wrapMode(
        DataType.Enum(Pango.WrapMode),
        (v) => (this.gobject.wrap_mode = v)
      )
      .justify(
        DataType.Enum(Gtk.Justification),
        (v) => (this.gobject.justify = v)
      )
      .children(DataType.String, (v) => this.appendChild(v));
  }

  render() {
    this.parent?.show_all();
  }
}
