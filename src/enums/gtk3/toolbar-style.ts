import Gtk from "gi://Gtk?version=3.0";

/**
 * Used to customize the appearance of a #GtkToolbar. Note that
 * setting the toolbar style overrides the user’s preferences for the
 * default toolbar style. Note that if the button has only a label set
 * and GTK_TOOLBAR_ICONS is used, the label will be visible, and vice
 * versa.
 */
// @ts-expect-error
declare enum ToolbarStyle {
  /** Buttons display only icons in the toolbar. */
  ICONS = 0,
  /** Buttons display only text labels in the toolbar. */
  TEXT = 1,
  /** Buttons display text and icons in the toolbar. */
  BOTH = 2,
  /**
   * Buttons display icons and text alongside each other, rather than
   * vertically stacked
   */
  BOTH_HORIZ = 3,
}

// @ts-expect-error
const ToolbarStyle = Gtk.ToolbarStyle;

export default ToolbarStyle;
