import Gdk from "gi://Gdk";
import { KeyPressModifiers } from "../../../enums/custom";

declare global {
  namespace Rg {
    type KeyPressEventData = {
      /**
       * A modifier key(s) that was pressed at the same time.
       */
      modifier: KeyPressModifiers;
      /**
       * ASCII character code of the pressed button.
       */
      keyCode: number;
    };
  }
}

export const mapKeypressEventState = (
  event: Gdk.Event & Gdk.EventKey,
) => {
  const state = event.get_state()[1];

  const isShift = (state | Gdk.ModifierType.SHIFT_MASK) === state;
  const isCtrl = (state | Gdk.ModifierType.CONTROL_MASK) === state;
  const isAlt = (state | Gdk.ModifierType.MOD1_MASK) === state;

  if (isShift && isCtrl && isAlt) {
    return KeyPressModifiers.SHIFT_CTR_ALT;
  }

  if (isShift && isCtrl) {
    return KeyPressModifiers.SHIFT_CTRL;
  }

  if (isShift && isAlt) {
    return KeyPressModifiers.SHIFT_ALT;
  }

  if (isCtrl && isAlt) {
    return KeyPressModifiers.CTR_ALT;
  }

  if (isShift) {
    return KeyPressModifiers.SHIFT;
  }

  if (isCtrl) {
    return KeyPressModifiers.CTRL;
  }

  if (isAlt) {
    return KeyPressModifiers.ALT;
  }

  return KeyPressModifiers.NONE;
};

export const mapKeyCode = (event: Gdk.Event & Gdk.EventKey) => {
  const keyval = event.get_keyval()[1]!;

  switch (keyval) {
    case 65293: // Enter
      return 13;
    case 65288: // Backspace
      return 8;
    case 65470: // F1
      return 112;
    case 65471: // F2
      return 113;
    case 65472: // F3
      return 114;
    case 65473: // F4
      return 115;
    case 65474: // F5
      return 116;
    case 65475: // F6
      return 117;
    case 65476: // F7
      return 118;
    case 65477: // F8
      return 119;
    case 65478: // F9
      return 120;
    case 65479: // F10
      return 121;
    case 65480: // F11
      return 122;
    case 65481: // F12
      return 123;
    case 65300: // Scroll Lock
      return 145;
    case 65299: // Pause
      return 19;
    case 65379: // Insert
      return 45;
    case 65535: // Delete
      return 46;
    case 65360: // Home
      return 36;
    case 65367: // End
      return 35;
    case 65365: // Page Up
      return 33;
    case 65366: // Page Down
      return 34;
    case 65505: // Shift
      return 16;
    case 65507: // Ctrl
      return 17;
    case 65513: // Alt
      return 18;
    case 65289: // Tab
      return 9;
    case 65509: // Caps Lock
      return 20;
    default:
      return keyval;
  }
};

export const parseEventKey = (
  event: Gdk.Event & Gdk.EventKey,
  mustBeOfType?: Gdk.EventType,
): Rg.KeyPressEventData => {
  if (mustBeOfType && event.get_event_type() !== mustBeOfType) {
    throw Error("no-op");
  }

  return {
    keyCode: mapKeyCode(event),
    modifier: mapKeypressEventState(event),
  };
};
