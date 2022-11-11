import { DataType } from "dilswer";
import Gtk from "gi://Gtk?version=3.0";
import type { GjsElement } from "../gjs-element";
import { mapProperties } from "../utils/map-properties";

export type WindowProps = {
  title?: string;
  defaultWidth?: number;
  defaultHeight?: number;
  onDestroy?: () => void;
};

export class WindowElement implements GjsElement {
  readonly kind = "WINDOW";

  private gobject = new Gtk.Window();
  private parent: Gtk.Container | null = null;
  private onDestroyHandlerID: number | null = null;

  constructor(props: any) {
    this.updateProps(props);
  }

  appendTo(parent: Gtk.Container): void {
    this.parent = parent;
  }

  appendChild(child: string | GjsElement): void {
    if (typeof child === "string") {
      throw new Error("Window can only have other elements as it's children.");
    }

    child.appendTo(this.gobject);
  }

  updateProps(props: object): void {
    mapProperties<WindowProps>(props)
      .title(DataType.String, (v) => (this.gobject.title = v))
      .defaultWidth(DataType.Number, (v) => (this.gobject.default_width = v))
      .defaultHeight(DataType.Number, (v) => (this.gobject.default_height = v))
      .onDestroy(DataType.Function, (callback) => {
        if (this.onDestroyHandlerID) {
          this.gobject.disconnect(this.onDestroyHandlerID);
        }

        this.onDestroyHandlerID = this.gobject.connect("destroy", callback);
      });
  }

  remove(parent: GjsElement): void {
    this.gobject.destroy();
  }

  render(): void {
    this.gobject.show_all();
  }
}
