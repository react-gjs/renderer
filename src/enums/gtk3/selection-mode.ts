import Gtk from "gi://Gtk?version=3.0";

/** Used to control what selections users are allowed to make. */
// @ts-expect-error
declare enum SelectionMode {
  /** No selection is possible. */
  NONE = 0,
  /** Zero or one element may be selected. */
  SINGLE = 1,
  /**
   * Exactly one element is selected. In some circumstances, such as
   * initially or during a search operation, it’s possible for no
   * element to be selected with %GTK_SELECTION_BROWSE. What is really
   * enforced is that the user can’t deselect a currently selected
   * element except by selecting another element.
   */
  BROWSE = 2,
  /**
   * Any number of elements may be selected. The Ctrl key may be used
   * to enlarge the selection, and Shift key to select between the
   * focus and the child pointed to. Some widgets may also allow
   * Click-drag to select a range of elements.
   */
  MULTIPLE = 3,
}

// @ts-expect-error
const SelectionMode = Gtk.SelectionMode;

export default SelectionMode;
