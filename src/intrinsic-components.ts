import type { GjsElementTypes } from "./gjs-elements/gjs-element-types";

const IntrinsicElem = <E extends GjsElementTypes>(v: E): E => v;

/** Equivalent to the Gtk.Box widget. */
export const Box = IntrinsicElem("BOX");
/** Equivalent to the Gtk.Button widget. */
export const Button = IntrinsicElem("BUTTON");
/** Equivalent to the Gtk.CheckButton widget. */
export const CheckButton = IntrinsicElem("CHECK_BUTTON");
/** Equivalent to the Gtk.FlexBox widget. */
export const FlowBox = IntrinsicElem("FLOW_BOX");
/** Equivalent to the Gtk.FlexBoxChild widget. */
export const FlowBoxEntry = IntrinsicElem("FLOW_BOX_ENTRY");
/** Equivalent to the Gtk.Button widget. */
export const Label = IntrinsicElem("LABEL");
/** Equivalent to the Gtk.LinkButton widget. */
export const LinkButton = IntrinsicElem("LINK_BUTTON");
/** Equivalent to the Gtk.Switch widget. */
export const Switch = IntrinsicElem("SWITCH");
/** Equivalent to the Gtk.TextView widget. */
export const TextArea = IntrinsicElem("TEXT_AREA");
/** Equivalent to the Gtk.Entry widget. */
export const TextInput = IntrinsicElem("TEXT_ENTRY");
/** Equivalent to the Gtk.Window widget. */
export const Window = IntrinsicElem("WINDOW");
