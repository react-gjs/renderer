import type { GjsElementTypes } from "./reconciler/gjs-element-types";

const IntrinsicElem = <E extends GjsElementTypes>(v: E): E => v;

/** Equivalent to the Gtk.Box widget. */
export const Box = IntrinsicElem("BOX");
/** Equivalent to the Gtk.Button widget. */
export const Label = IntrinsicElem("LABEL");
/** Equivalent to the Gtk.Button widget. */
export const Button = IntrinsicElem("BUTTON");
/** Equivalent to the Gtk.Window widget. */
export const Window = IntrinsicElem("WINDOW");
/** Equivalent to the Gtk.Entry widget. */
export const TextInput = IntrinsicElem("TEXT_ENTRY");
/** Equivalent to the Gtk.TextView widget. */
export const TextArea = IntrinsicElem("TEXT_AREA");
