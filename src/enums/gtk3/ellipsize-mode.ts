import Pango from "gi://Pango?version=1.0";

/**
 * `PangoEllipsizeMode` describes what sort of ellipsization should be
 * applied to text.
 *
 * In the ellipsization process characters are removed from the text
 * in order to make it fit to a given width and replaced with an
 * ellipsis.
 */
// @ts-expect-error
declare enum EllipsizeMode {
  /** No ellipsization */
  NONE = 0,
  /** Omit characters at the start of the text */
  START = 1,
  /** Omit characters in the middle of the text */
  MIDDLE = 2,
  /** Omit characters at the end of the text */
  END = 3,
}

// @ts-expect-error
const EllipsizeMode = Pango.EllipsizeMode;

export default EllipsizeMode;
