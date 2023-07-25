import Gtk from "gi://Gtk?version=3.0";

/**
 * The mode of the size group determines the directions in which the
 * size group affects the requested sizes of its component widgets.
 */
// @ts-expect-error
declare enum SizeGroupMode {
  /**
   * Group has no effect
   */
  NONE = 0,
  /**
   * Group affects horizontal requisition
   */
  HORIZONTAL = 1,
  /**
   * Group affects vertical requisition
   */
  VERTICAL = 2,
  /**
   * Group affects both horizontal and vertical requisition
   */
  BOTH = 3,
}

// @ts-expect-error
const SizeGroupMode = Gtk.SizeGroupMode;

export default SizeGroupMode;
