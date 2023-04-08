import Gtk from "gi://Gtk?version=3.0";
import Pango from "gi://Pango";
import { WrapMode } from "../../enums/custom";

export const TO_PANGO_WRAP_MODE = new Map([
  [WrapMode.NONE, Pango.WrapMode.CHAR],
  [WrapMode.CHAR, Pango.WrapMode.CHAR],
  [WrapMode.WORD, Pango.WrapMode.WORD],
  [WrapMode.WORD_CHAR, Pango.WrapMode.WORD_CHAR],
]);

export const TO_GTK_WRAP_MODE = new Map([
  [WrapMode.NONE, Gtk.WrapMode.NONE],
  [WrapMode.CHAR, Gtk.WrapMode.CHAR],
  [WrapMode.WORD, Gtk.WrapMode.WORD],
  [WrapMode.WORD_CHAR, Gtk.WrapMode.WORD_CHAR],
]);
