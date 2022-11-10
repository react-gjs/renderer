import Gtk from "gi://Gtk?version=3.0";
import type { GjsInstances } from "../gjs-element-types";

export const updateInstance = (
  element: GjsInstances,
  props: { children?: string }
) => {
  if (element instanceof Gtk.Label) {
    if (typeof props.children === "string") element.set_text(props.children);
    else throw new Error("Only text can be appended to labels.");
  }
};
