import type { GjsElementTypes } from "./reconciler/gjs-element-types";

const IntrinsicElem = <E extends GjsElementTypes>(v: E): E => v;

export const Box = IntrinsicElem("BOX");
export const Label = IntrinsicElem("LABEL");
export const Button = IntrinsicElem("BUTTON");
export const Window = IntrinsicElem("WINDOW");
