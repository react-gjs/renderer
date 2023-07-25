import Gtk from "gi://Gtk?version=3.0";

/**
 * Specifies which corner a child widget should be placed in when
 * packed into a #GtkScrolledWindow. This is effectively the opposite
 * of where the scroll bars are placed.
 */
// @ts-expect-error
declare enum CornerType {
  /**
   * Place the scrollbars on the right and bottom of the widget
   * (default behaviour).
   */
  TOP_LEFT = 0,
  /**
   * Place the scrollbars on the top and right of the widget.
   */
  BOTTOM_LEFT = 1,
  /**
   * Place the scrollbars on the left and bottom of the widget.
   */
  TOP_RIGHT = 2,
  /**
   * Place the scrollbars on the top and left of the widget.
   */
  BOTTOM_RIGHT = 3,
}

// @ts-expect-error
const CornerType = Gtk.CornerType;

export default CornerType;
