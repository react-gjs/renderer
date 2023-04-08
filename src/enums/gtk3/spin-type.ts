import Gtk from "gi://Gtk?version=3.0";

/**
 * The values of the GtkSpinType enumeration are used to specify the
 * change to make in gtk_spin_button_spin().
 */
// @ts-expect-error
declare enum SpinType {
  STEP_FORWARD = 0,
  STEP_BACKWARD = 1,
  PAGE_FORWARD = 2,
  PAGE_BACKWARD = 3,
  HOME = 4,
  END = 5,
  USER_DEFINED = 6,
}

// @ts-expect-error
const SpinType = Gtk.SpinType;

export default SpinType;
