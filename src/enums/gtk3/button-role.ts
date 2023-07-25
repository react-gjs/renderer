import Gtk from "gi://Gtk?version=3.0";

/**
 * The role specifies the desired appearance of a #GtkModelButton.
 */
// @ts-expect-error
declare enum ButtonRole {
  NORMAL = 0,
  CHECK = 1,
  RADIO = 2,
}

// @ts-expect-error
const ButtonRole = Gtk.ButtonRole;

export default ButtonRole;
