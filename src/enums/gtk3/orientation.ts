import Gtk from "gi://Gtk?version=3.0";

/**
 * Represents the orientation of widgets and other objects which can
 * be switched between horizontal and vertical orientation on the fly,
 * like #GtkToolbar or #GtkGesturePan.
 */
// @ts-expect-error
declare enum Orientation {
  HORIZONTAL = 0,
  VERTICAL = 1,
}

// @ts-expect-error
const Orientation = Gtk.Orientation;

export default Orientation;
