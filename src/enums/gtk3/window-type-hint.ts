import Gdk from "gi://Gdk";

/**
 * These are hints for the window manager that indicate what type of
 * function the window has. The window manager can use this when
 * determining decoration and behaviour of the window. The hint must
 * be set before mapping the window.
 *
 * See the [Extended Window Manager
 * Hints](http://www.freedesktop.org/Standards/wm-spec) specification
 * for more details about window types.
 */
// @ts-expect-error
declare enum WindowTypeHint {
  /**
   * Normal toplevel window.
   */
  NORMAL = 0,
  /**
   * Dialog window.
   */
  DIALOG = 1,
  /**
   * Window used to implement a menu; GTK+ uses this hint only for
   * torn-off menus, see #GtkTearoffMenuItem.
   */
  MENU = 2,
  /**
   * Window used to implement toolbars.
   */
  TOOLBAR = 3,
  /**
   * Window used to display a splash screen during application
   * startup.
   */
  SPLASHSCREEN = 4,
  /**
   * Utility windows which are not detached toolbars or dialogs.
   */
  UTILITY = 5,
  /**
   * Used for creating dock or panel windows.
   */
  DOCK = 6,
  /**
   * Used for creating the desktop background window.
   */
  DESKTOP = 7,
  /**
   * A menu that belongs to a menubar.
   */
  DROPDOWN_MENU = 8,
  /**
   * A menu that does not belong to a menubar, e.g. a context menu.
   */
  POPUP_MENU = 9,
  /**
   * A tooltip.
   */
  TOOLTIP = 10,
  /**
   * A notification - typically a “bubble” that belongs to a status
   * icon.
   */
  NOTIFICATION = 11,
  /**
   * A popup from a combo box.
   */
  COMBO = 12,
  /**
   * A window that is used to implement a DND cursor.
   */
  DND = 13,
}

// @ts-expect-error
const WindowTypeHint = Gdk.WindowTypeHint;

export default WindowTypeHint;
