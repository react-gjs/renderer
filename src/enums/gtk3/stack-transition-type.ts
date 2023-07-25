import Gtk from "gi://Gtk?version=3.0";

/**
 * These enumeration values describe the possible transitions between
 * pages in a #GtkStack widget.
 *
 * New values may be added to this enumeration over time.
 */
// @ts-expect-error
declare enum StackTransitionType {
  NONE = 0,
  CROSSFADE = 1,
  SLIDE_RIGHT = 2,
  SLIDE_LEFT = 3,
  SLIDE_UP = 4,
  SLIDE_DOWN = 5,
  SLIDE_LEFT_RIGHT = 6,
  SLIDE_UP_DOWN = 7,
  OVER_UP = 8,
  OVER_DOWN = 9,
  OVER_LEFT = 10,
  OVER_RIGHT = 11,
  UNDER_UP = 12,
  UNDER_DOWN = 13,
  UNDER_LEFT = 14,
  UNDER_RIGHT = 15,
  OVER_UP_DOWN = 16,
  OVER_DOWN_UP = 17,
  OVER_LEFT_RIGHT = 18,
  OVER_RIGHT_LEFT = 19,
}

// @ts-expect-error
const StackTransitionType = Gtk.StackTransitionType;

export default StackTransitionType;
