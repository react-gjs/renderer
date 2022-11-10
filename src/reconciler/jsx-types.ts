import type Gtk from "gi://Gtk?version=3.0";

export type ComponentAttributes<P> = {
  children?: React.ReactNode;
} & P;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      WINDOW: ComponentAttributes<Partial<Gtk.WindowInitOptions>>;
      BUTTON: ComponentAttributes<Partial<Gtk.ButtonInitOptions>>;
      VBOX: ComponentAttributes<Partial<Gtk.VBoxInitOptions>>;
      HBOX: ComponentAttributes<Partial<Gtk.HBoxInitOptions>>;
      LABEL: ComponentAttributes<Partial<Gtk.LabelInitOptions>>;
    }
  }
}
