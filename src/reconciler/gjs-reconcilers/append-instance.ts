import Gtk from "gi://Gtk?version=3.0";
import type { GjsInstances } from "../gjs-element-types";

export const appendInstance = (parent: GjsInstances, child: GjsInstances) => {
  if (parent instanceof Gtk.Window) {
    parent.add(child);
  }
  if (parent instanceof Gtk.VBox) {
    parent.add(child);
  }
  if (parent instanceof Gtk.HBox) {
    parent.add(child);
  }
  if (parent instanceof Gtk.Button) {
    parent.add(child);
  }
  if (parent instanceof Gtk.Label) {
    if (typeof child === "string") {
      parent.set_markup(`<p>${child}</p>`);
    } else {
      throw new Error("Only text can be appended to labels.");
    }
  }
};
