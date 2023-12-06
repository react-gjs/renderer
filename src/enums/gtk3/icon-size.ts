import Gtk from "gi://Gtk";

/** Built-in stock icon sizes. */
// @ts-expect-error
declare enum IconSize {
  /** Invalid size. */
  INVALID = 0,
  /** Size appropriate for menus (16px). */
  MENU = 1,
  /** Size appropriate for small toolbars (16px). */
  SMALL_TOOLBAR = 2,
  /** Size appropriate for large toolbars (24px) */
  LARGE_TOOLBAR = 3,
  /** Size appropriate for buttons (16px) */
  BUTTON = 4,
  /** Size appropriate for drag and drop (32px) */
  DND = 5,
  /** Size appropriate for dialogs (48px) */
  DIALOG = 6,
}

// @ts-expect-error
const IconSize = Gtk.IconSize;

export default IconSize;
