import Gtk from "gi://Gtk?version=3.0";

/**
 * Whenever a container has some form of natural row it may align
 * children in that row along a common typographical baseline. If the
 * amount of verical space in the row is taller than the total
 * requested height of the baseline-aligned children then it can use a
 * #GtkBaselinePosition to select where to put the baseline inside the
 * extra availible space.
 */
// @ts-expect-error
declare enum BaselinePosition {
  /**
   * Align the baseline at the top
   */
  TOP = 0,
  /**
   * Center the baseline
   */
  CENTER = 1,
  /**
   * Align the baseline at the bottom
   */
  BOTTOM = 2,
}

// @ts-expect-error
const BaselinePosition = Gtk.BaselinePosition;

export default BaselinePosition;
