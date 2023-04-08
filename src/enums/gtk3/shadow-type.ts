import Gtk from "gi://Gtk?version=3.0";

/**
 * Used to change the appearance of an outline typically provided by a
 * #GtkFrame.
 *
 * Note that many themes do not differentiate the appearance of the
 * various shadow types: Either their is no visible shadow
 * (`GTK_SHADOW_NONE)`, or there is (any other value).
 */
// @ts-expect-error
declare enum ShadowType {
  NONE = 0,
  IN = 1,
  OUT = 2,
  ETCHED_IN = 3,
  ETCHED_OUT = 4,
}

// @ts-expect-error
const ShadowType = Gtk.ShadowType;

export default ShadowType;
