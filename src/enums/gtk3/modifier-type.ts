import Gdk from "gi://Gdk";

// @ts-expect-error
declare enum AccelModifier {
  /** The Shift key. */
  SHIFT_MASK = 1,
  /**
   * A Lock key (depending on the modifier mapping of the X server
   * this may either be CapsLock or ShiftLock).
   */
  LOCK_MASK = 2,
  /** The Control key. */
  CONTROL_MASK = 4,
  /**
   * The fourth modifier key (it depends on the modifier mapping of
   * the X server which key is interpreted as this modifier, but
   * normally it is the Alt key).
   */
  MOD1_MASK = 8,
  /**
   * The fifth modifier key (it depends on the modifier mapping of the
   * X server which key is interpreted as this modifier).
   */
  MOD2_MASK = 16,
  /**
   * The sixth modifier key (it depends on the modifier mapping of the
   * X server which key is interpreted as this modifier).
   */
  MOD3_MASK = 32,
  /**
   * The seventh modifier key (it depends on the modifier mapping of
   * the X server which key is interpreted as this modifier).
   */
  MOD4_MASK = 64,
  /**
   * The eighth modifier key (it depends on the modifier mapping of
   * the X server which key is interpreted as this modifier).
   */
  MOD5_MASK = 128,
  /** The first mouse button. */
  BUTTON1_MASK = 256,
  /** The second mouse button. */
  BUTTON2_MASK = 512,
  /** The third mouse button. */
  BUTTON3_MASK = 1024,
  /** The fourth mouse button. */
  BUTTON4_MASK = 2048,
  /** The fifth mouse button. */
  BUTTON5_MASK = 4096,
  /** The Super modifier. Since 2.10 */
  SUPER_MASK = 67108864,
  /** The Hyper modifier. Since 2.10 */
  HYPER_MASK = 134217728,
  /** The Meta modifier. Since 2.10 */
  META_MASK = 268435456,
  /**
   * Not used in GDK itself. GTK+ uses it to differentiate between
   * (keyval, modifiers) pairs from key press and release events.
   */
  RELEASE_MASK = 1073741824,
  /** A mask covering all modifier types. */
  MODIFIER_MASK = 1543512063,
}

// @ts-expect-error
const AccelModifier = Gdk.ModifierType as any;

export default AccelModifier;
