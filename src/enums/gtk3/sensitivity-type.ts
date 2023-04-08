import Gtk from "gi://Gtk?version=3.0";

/**
 * Determines how GTK+ handles the sensitivity of stepper arrows at
 * the end of range widgets.
 */
// @ts-expect-error
declare enum SensitivityType {
  /** The arrow is made insensitive if the thumb is at the end */
  AUTO = 0,
  /** The arrow is always sensitive */
  ON = 1,
  /** The arrow is always insensitive */
  OFF = 2,
}

// @ts-expect-error
const SensitivityType = Gtk.SensitivityType;

export default SensitivityType;
