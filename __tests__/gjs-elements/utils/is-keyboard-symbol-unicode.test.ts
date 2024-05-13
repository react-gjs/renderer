import { describe, expect, it } from "@reactgjs/gest";
import Gdk from "gi://Gdk?version=3.0";
import { isKeyboardSymbol } from "../../../src/gjs-elements/utils/is-keyboard-symbol-unicode";

export default describe("isKeyboardSymbol", () => {
  it("should return true for keyboard symbols", () => {
    const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split(
      "",
    );
    const numbers = "0123456789".split("");
    const symbols = "!@#$%^&*()_+=-[];',./?><:\"}{|`".split("");

    for (const letter of letters) {
      expect(isKeyboardSymbol(letter.charCodeAt(0))).toBe(true);
    }

    for (const num of numbers) {
      expect(isKeyboardSymbol(num.charCodeAt(0))).toBe(true);
    }

    for (const sym of symbols) {
      expect(isKeyboardSymbol(sym.charCodeAt(0))).toBe(true);
    }
  });

  it("should return true for Gdk constants", () => {
    const gdkConstants = [
      Gdk.KEY_A,
      Gdk.KEY_B,
      Gdk.KEY_C,
      Gdk.KEY_D,
      Gdk.KEY_E,
      Gdk.KEY_F,
      Gdk.KEY_G,
      Gdk.KEY_H,
      Gdk.KEY_I,
      Gdk.KEY_J,
      Gdk.KEY_K,
      Gdk.KEY_L,
      Gdk.KEY_M,
      Gdk.KEY_N,
      Gdk.KEY_O,
      Gdk.KEY_P,
      Gdk.KEY_Q,
      Gdk.KEY_R,
      Gdk.KEY_S,
      Gdk.KEY_T,
      Gdk.KEY_U,
      Gdk.KEY_V,
      Gdk.KEY_W,
      Gdk.KEY_X,
      Gdk.KEY_Y,
      Gdk.KEY_Z,
      Gdk.KEY_a,
      Gdk.KEY_b,
      Gdk.KEY_c,
      Gdk.KEY_d,
      Gdk.KEY_e,
      Gdk.KEY_f,
      Gdk.KEY_g,
      Gdk.KEY_h,
      Gdk.KEY_i,
      Gdk.KEY_j,
      Gdk.KEY_k,
      Gdk.KEY_l,
      Gdk.KEY_m,
      Gdk.KEY_n,
      Gdk.KEY_o,
      Gdk.KEY_p,
      Gdk.KEY_q,
      Gdk.KEY_r,
      Gdk.KEY_s,
      Gdk.KEY_t,
      Gdk.KEY_u,
      Gdk.KEY_v,
      Gdk.KEY_w,
      Gdk.KEY_x,
      Gdk.KEY_y,
      Gdk.KEY_z,
      Gdk.KEY_0,
      Gdk.KEY_1,
      Gdk.KEY_2,
      Gdk.KEY_3,
      Gdk.KEY_4,
      Gdk.KEY_5,
      Gdk.KEY_6,
      Gdk.KEY_7,
      Gdk.KEY_8,
      Gdk.KEY_9,
      Gdk.KEY_exclam,
      Gdk.KEY_quotedbl,
      Gdk.KEY_numbersign,
      Gdk.KEY_dollar,
      Gdk.KEY_percent,
      Gdk.KEY_ampersand,
      Gdk.KEY_apostrophe,
      Gdk.KEY_parenleft,
      Gdk.KEY_parenright,
      Gdk.KEY_asterisk,
      Gdk.KEY_plus,
      Gdk.KEY_comma,
      Gdk.KEY_minus,
      Gdk.KEY_period,
      Gdk.KEY_slash,
      Gdk.KEY_colon,
      Gdk.KEY_semicolon,
      Gdk.KEY_less,
      Gdk.KEY_equal,
      Gdk.KEY_greater,
      Gdk.KEY_question,
      Gdk.KEY_at,
      Gdk.KEY_bracketleft,
      Gdk.KEY_backslash,
      Gdk.KEY_bracketright,
      Gdk.KEY_asciicircum,
      Gdk.KEY_underscore,
      Gdk.KEY_grave,
      Gdk.KEY_braceleft,
      Gdk.KEY_bar,
      Gdk.KEY_braceright,
      Gdk.KEY_asciitilde,
    ];

    for (const constant of gdkConstants) {
      expect(isKeyboardSymbol(Gdk.keyval_to_unicode(constant))).toBe(
        true,
      );
    }
  });

  it("should return false for non-keyboard symbols", () => {
    expect(isKeyboardSymbol("␡".charCodeAt(0))).toBe(false);
    expect(isKeyboardSymbol("¡".charCodeAt(0))).toBe(false);
    expect(isKeyboardSymbol("¢".charCodeAt(0))).toBe(false);
    expect(isKeyboardSymbol("£".charCodeAt(0))).toBe(false);
    expect(isKeyboardSymbol("¥".charCodeAt(0))).toBe(false);
    expect(isKeyboardSymbol("À".charCodeAt(0))).toBe(false);
    expect(isKeyboardSymbol("Ø".charCodeAt(0))).toBe(false);
    expect(isKeyboardSymbol("ú".charCodeAt(0))).toBe(false);
    expect(isKeyboardSymbol("ÿ".charCodeAt(0))).toBe(false);
    expect(isKeyboardSymbol("".charCodeAt(0))).toBe(false);
    expect(isKeyboardSymbol("®".charCodeAt(0))).toBe(false);
    expect(isKeyboardSymbol("©".charCodeAt(0))).toBe(false);
  });
});
