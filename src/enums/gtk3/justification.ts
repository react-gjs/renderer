import Gtk from "gi://Gtk?version=3.0";

/**
 * Used for justifying the text inside a #GtkLabel widget. (See also
 * #GtkAlignment).
 */
// @ts-expect-error
declare enum Justification {
  LEFT = 0,
  RIGHT = 1,
  CENTER = 2,
  FILL = 3,
}

// @ts-expect-error
const Justification = Gtk.Justification;

export default Justification;
