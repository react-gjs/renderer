import { DataType } from "dilswer";
import Gtk from "gi://Gtk?version=3.0";
import type { GjsElement } from "../gjs-element";
import { mapProperties } from "../utils/map-properties";

export type ButtonProps = {
  label?: string;
  onClick?: () => void;
  image?: Gtk.Widget;
  imagePosition?: Gtk.PositionType;
  useUnderline?: boolean;
};

const WidgetDataType = DataType.Custom(
  (v: any): v is Gtk.Widget => typeof v === "object"
);

export class ButtonElement implements GjsElement {
  readonly kind = "BUTTON";

  private gobject = new Gtk.Button();
  private parent: Gtk.Container | null = null;
  private lastOnClickHandlerID: number | null = null;

  constructor(props: any) {
    this.updateProps(props);
  }

  appendTo(parent: Gtk.Container): void {
    parent.add(this.gobject);
    this.parent = parent;
  }

  appendChild(child: string | GjsElement): void {
    if (typeof child === "string") {
      this.gobject.label = child;
    } else {
      child.appendTo(this.gobject);
    }
    this.gobject.show_all();
  }

  updateProps(props: object): void {
    mapProperties<ButtonProps>(props)
      .label(DataType.String, (v) => (this.gobject.label = v))
      .image(WidgetDataType, (v) => {
        this.gobject.image = v;
      })
      .imagePosition(
        DataType.Enum(Gtk.PositionType),
        (v) => (this.gobject.image_position = v)
      )
      .useUnderline(DataType.Boolean, (v) => (this.gobject.use_underline = v))
      .onClick(DataType.Function, (callback) => {
        if (this.lastOnClickHandlerID) {
          this.gobject.disconnect(this.lastOnClickHandlerID);
        }
        this.lastOnClickHandlerID = this.gobject.connect("clicked", callback);
      });
  }

  remove(parent: GjsElement): void {
    this.gobject.destroy();
  }

  render() {
    this.parent?.show_all();
  }
}
