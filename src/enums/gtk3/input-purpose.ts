import Gtk from "gi://Gtk?version=3.0";

/**
 * Describes primary purpose of the input widget. This information is
 * useful for on-screen keyboards and similar input methods to decide
 * which keys should be presented to the user.
 *
 * Note that the purpose is not meant to impose a totally strict rule
 * about allowed characters, and does not replace input validation. It
 * is fine for an on-screen keyboard to let the user override the
 * character set restriction that is expressed by the purpose. The
 * application is expected to validate the entry contents, even if it
 * specified a purpose.
 *
 * The difference between `GTK_INPUT_PURPOSE_DIGITS` and
 * `GTK_INPUT_PURPOSE_NUMBER` is that the former accepts only digits
 * while the latter also some punctuation (like commas or points,
 * plus, minus) and “e” or “E” as in 3.14E+000.
 *
 * This enumeration may be extended in the future; input methods
 * should interpret unknown values as “free form”.
 */
// @ts-expect-error
declare enum InputPurpose {
  /**
   * Allow any character
   */
  FREE_FORM = 0,
  /**
   * Allow only alphabetic characters
   */
  ALPHA = 1,
  /**
   * Allow only digits
   */
  DIGITS = 2,
  /**
   * Edited field expects numbers
   */
  NUMBER = 3,
  /**
   * Edited field expects phone number
   */
  PHONE = 4,
  /**
   * Edited field expects URL
   */
  URL = 5,
  /**
   * Edited field expects email address
   */
  EMAIL = 6,
  /**
   * Edited field expects the name of a person
   */
  NAME = 7,
  /**
   * Like `GTK_INPUT_PURPOSE_FREE_FORM,` but characters are hidden
   */
  PASSWORD = 8,
  /**
   * Like `GTK_INPUT_PURPOSE_DIGITS,` but characters are hidden
   */
  PIN = 9,
  /**
   * Allow any character, in addition to control codes
   */
  TERMINAL = 10,
}

// @ts-expect-error
const InputPurpose = Gtk.InputPurpose;

export default InputPurpose;
