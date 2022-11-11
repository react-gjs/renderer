import type Gtk from "gi://Gtk?version=3.0";

export type GjsElementTypes = "WINDOW" | "BUTTON" | "BOX" | "LABEL";

export type GjsInstances =
  | Gtk.Window
  | Gtk.Button
  | Gtk.VBox
  | Gtk.HBox
  | Gtk.Label;
