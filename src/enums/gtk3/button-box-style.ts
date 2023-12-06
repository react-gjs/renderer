import Gtk from "gi://Gtk?version=3.0";

/**
 * Used to dictate the style that a #GtkButtonBox uses to layout the
 * buttons it contains.
 */
// @ts-expect-error
declare enum ButtonBoxStyle {
  /** Buttons are evenly spread across the box. */
  SPREAD = 0,
  /** Buttons are placed at the edges of the box. */
  EDGE = 1,
  /**
   * Buttons are grouped towards the start of the box, (on the left
   * for a HBox, or the top for a VBox).
   */
  START = 2,
  /**
   * Buttons are grouped towards the end of the box, (on the right for
   * a HBox, or the bottom for a VBox).
   */
  END = 3,
  /** Buttons are centered in the box. Since 2.12. */
  CENTER = 4,
  /**
   * Buttons expand to fill the box. This entails giving buttons a
   * "linked" appearance, making button sizes homogeneous, and setting
   * spacing to 0 (same as calling gtk_box_set_homogeneous() and
   * gtk_box_set_spacing() manually). Since 3.12.
   */
  EXPAND = 5,
}

// @ts-expect-error
const ButtonBoxStyle = Gtk.ButtonBoxStyle;

export default ButtonBoxStyle;
