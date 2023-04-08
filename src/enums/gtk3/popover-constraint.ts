import Gtk from "gi://Gtk?version=3.0";

/**
 * Describes constraints to positioning of popovers. More values may
 * be added to this enumeration in the future.
 */
// @ts-expect-error
declare enum PopoverConstraint {
  /**
   * Don't constrain the popover position beyond what is imposed by
   * the implementation
   */
  NONE = 0,
  /**
   * Constrain the popover to the boundaries of the window that it is
   * attached to
   */
  WINDOW = 1,
}

// @ts-expect-error
const PopoverConstraint = Gtk.PopoverConstraint;

export default PopoverConstraint;
