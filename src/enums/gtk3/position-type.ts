import Gtk from "gi://Gtk?version=3.0";

/**
 * Describes which edge of a widget a certain feature is positioned
 * at, e.g. the tabs of a #GtkNotebook, the handle of a
 * #GtkHandleBox or the label of a #GtkScale.
 */
// @ts-expect-error
declare enum PositionType {
  LEFT = 0,
  RIGHT = 1,
  TOP = 2,
  BOTTOM = 3,
}

// @ts-expect-error
const PositionType = Gtk.PositionType;

export default PositionType;
