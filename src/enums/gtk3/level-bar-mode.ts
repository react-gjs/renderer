import Gtk from "gi://Gtk?version=3.0";

/**
 * Represents the packing location #GtkBox children. (See: #GtkVBox,
 * #GtkHBox, and #GtkButtonBox).
 */
// @ts-expect-error
declare enum LevelBarMode {
  CONTINUOUS = 0,
  DISCRETE = 1,
}

// @ts-expect-error
const LevelBarMode = Gtk.LevelBarMode;

export default LevelBarMode;
