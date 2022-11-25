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
/** Equivalent to the Gtk.Grid widget. */
export const Grid = IntrinsicElem("GRID");
export const GridItem = IntrinsicElem("GRID_ITEM");
/** Equivalent to the Gtk.Button widget. */
export const Label = IntrinsicElem("LABEL");
/** Equivalent to the Gtk.LinkButton widget. */
export const LinkButton = IntrinsicElem("LINK_BUTTON");
/** Equivalent to the Gtk.Image widget. */
export const Image = IntrinsicElem("IMAGE");
/** Equivalent to the Gtk.EventBox widget. */
export const Pressable = IntrinsicElem("PRESSABLE");
/** Equivalent to the Gtk.ScrolledWindow widget. */
export const ScrollBox = IntrinsicElem("SCROLL_BOX");
/** Built on top of the Gtk.ComboBox widget. */
export const Selector = IntrinsicElem("SELECTOR");
/** Equivalent to the Gtk.Separator widget. */
export const Separator = IntrinsicElem("SEPARATOR");
/** Equivalent to the Gtk.Switch widget. */
export const Switch = IntrinsicElem("SWITCH");
/** Equivalent to the Gtk.TextView widget. */
export const TextArea = IntrinsicElem("TEXT_AREA");
/** Equivalent to the Gtk.Entry widget. */
export const TextInput = IntrinsicElem("TEXT_ENTRY");
/** Equivalent to the Gtk.Window widget. */
export const Window = IntrinsicElem("WINDOW");

export { Popover } from "./gjs-elements/popover/component";
