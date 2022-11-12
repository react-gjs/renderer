import type Gtk from "gi://Gtk?version=3.0";

export type GjsElementTypes =
  | "WINDOW"
  | "BUTTON"
  | "BOX"
  | "LABEL"
  | "TEXT_ENTRY"
  | "TEXT_AREA";

export type GjsInstances =
  | Gtk.Window
  | Gtk.Button
  | Gtk.VBox
  | Gtk.HBox
  | Gtk.Label;
