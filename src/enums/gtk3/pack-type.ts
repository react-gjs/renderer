import Gtk from "gi://Gtk?version=3.0";

/**
 * Represents the packing location #GtkBox children. (See: #GtkVBox,
 * #GtkHBox, and #GtkButtonBox).
 */
// @ts-expect-error
declare enum PackType {
  START = 0,
  END = 1,
}

// @ts-expect-error
const PackType = Gtk.PackType;

export default PackType;
