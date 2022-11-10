import Gtk from "gi://Gtk?version=3.0";
import type { GjsElementTypes } from "../gjs-element-types";

export const createInstance = (
  type: GjsElementTypes,
  props: Partial<
    | Gtk.WindowInitOptions
    | Gtk.ButtonInitOptions
    | Gtk.VBoxInitOptions
    | Gtk.HBoxInitOptions
    | Gtk.LabelInitOptions
  > & {
    children?: any;
  }
) => {
  switch (type) {
    case "WINDOW": {
      const { children, ...windowProps } = props;
      const window = new Gtk.Window(windowProps);
      return window;
    }
    case "BUTTON": {
      const { children, ...buttonProps } = props;
      const button = new Gtk.Button(buttonProps);
      return button;
    }
    case "VBOX": {
      const { children, ...vboxProps } = props;
      const vbox = new Gtk.VBox(vboxProps);
      return vbox;
    }
    case "HBOX": {
      const { children, ...hboxProps } = props;
      const hbox = new Gtk.HBox(hboxProps);
      return hbox;
    }
    case "LABEL": {
      const { children, ...labelProps } = props;
      const label = new Gtk.Label(labelProps);
      return label;
    }
    default: {
      throw new Error("Type not implemented.");
    }
  }
};
