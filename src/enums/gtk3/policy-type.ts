import Gtk from "gi://Gtk?version=3.0";

/**
 * Determines how the size should be computed to achieve the one of
 * the visibility mode for the scrollbars.
 */
// @ts-expect-error
declare enum PolicyType {
  /**
   * The scrollbar is always visible. The view size is independent of
   * the content.
   */
  ALWAYS = 0,
  /**
   * The scrollbar will appear and disappear as necessary. For
   * example, when all of a #GtkTreeView can not be seen.
   */
  AUTOMATIC = 1,
  /**
   * The scrollbar should never appear. In this mode the content
   * determines the size.
   */
  NEVER = 2,
  /**
   * Don't show a scrollbar, but don't force the size to follow the
   * content. This can be used e.g. to make multiple scrolled windows
   * share a scrollbar. Since: 3.16
   */
  EXTERNAL = 3,
}

// @ts-expect-error
const PolicyType = Gtk.PolicyType;

export default PolicyType;
