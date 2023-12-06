import Gtk from "gi://Gtk?version=3.0";

/**
 * Describes the image data representation used by a #GtkImage. If you
 * want to get the image from the widget, you can only get the
 * currently-stored representation. e.g. if the
 * gtk_image_get_storage_type() returns #GTK_IMAGE_PIXBUF, then you
 * can call gtk_image_get_pixbuf() but not gtk_image_get_stock(). For
 * empty images, you can request any storage type (call any of the
 * "get" functions), but they will all return %NULL values.
 */
// @ts-expect-error
declare enum ImageType {
  /** There is no image displayed by the widget */
  EMPTY = 0,
  /** The widget contains a #GdkPixbuf */
  PIXBUF = 1,
  /** The widget contains a [stock item name][gtkstock] */
  STOCK = 2,
  /** The widget contains a #GtkIconSet */
  ICON_SET = 3,
  /** The widget contains a #GdkPixbufAnimation */
  ANIMATION = 4,
  /**
   * The widget contains a named icon. This image type was added in
   * GTK+ 2.6
   */
  ICON_NAME = 5,
  /**
   * The widget contains a #GIcon. This image type was added in GTK+
   * 2.14
   */
  GICON = 6,
  /**
   * The widget contains a #cairo_surface_t. This image type was added
   * in GTK+ 3.10
   */
  SURFACE = 7,
}

// @ts-expect-error
const ImageType = Gtk.ImageType;

export default ImageType;
