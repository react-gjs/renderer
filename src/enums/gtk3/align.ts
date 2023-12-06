import Gtk from "gi://Gtk?version=3.0";

/**
 * Controls how a widget deals with extra space in a single (x or y)
 * dimension.
 *
 * Alignment only matters if the widget receives a “too large”
 * allocation, for example if you packed the widget with the
 * #GtkWidget:expand flag inside a #GtkBox, then the widget might get
 * extra space. If you have for example a 16x16 icon inside a 32x32
 * space, the icon could be scaled and stretched, it could be
 * centered, or it could be positioned to one side of the space.
 *
 * Note that in horizontal context `GTK_ALIGN_START` and
 * `GTK_ALIGN_END` are interpreted relative to text direction.
 *
 * GTK_ALIGN_BASELINE support for it is optional for containers and
 * widgets, and it is only supported for vertical alignment. When its
 * not supported by a child or a container it is treated as
 * `GTK_ALIGN_FILL`.
 */
// @ts-expect-error
declare enum Align {
  /**
   * Stretch to fill all space if possible, center if no meaningful
   * way to stretch
   */
  FILL = 0,
  /** Snap to left or top side, leaving space on right or bottom */
  START = 1,
  /** Snap to right or bottom side, leaving space on left or top */
  END = 2,
  /** Center natural width of widget inside the allocation */
  CENTER = 3,
  /** Align the widget according to the baseline. Since 3.10. */
  BASELINE = 4,
}

// @ts-expect-error
const Align = Gtk.Align;

export default Align;
