import Gtk from "gi://Gtk?version=3.0";

/**
 * The spin button update policy determines whether the spin button
 * displays values even if they are outside the bounds of its
 * adjustment. See gtk_spin_button_set_update_policy().
 */
// @ts-expect-error
declare enum SpinButtonUpdatePolicy {
  /**
   * When refreshing your #GtkSpinButton, the value is always
   * displayed
   */
  ALWAYS = 0,
  /**
   * When refreshing your #GtkSpinButton, the value is only displayed
   * if it is valid within the bounds of the spin button's adjustment
   */
  IF_VALID = 1,
}

// @ts-expect-error
const SpinButtonUpdatePolicy = Gtk.SpinButtonUpdatePolicy;

export default SpinButtonUpdatePolicy;
