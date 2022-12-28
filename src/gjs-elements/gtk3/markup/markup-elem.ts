import type { GjsElement } from "../../gjs-element";
import type { MarkupElement } from "./markup";

export interface BaseMarkupElement extends GjsElement {
  stringify(): string;
  getMarkupRoot(): MarkupElement | undefined;
}

export type MarkupFontSize =
  | "xx-small"
  | "x-small"
  | "small"
  | "medium"
  | "large"
  | "x-large"
  | "xx-large"
  | "smaller"
  | "larger"
  | `${number}%`
  | number;

export type MarkupFontStyle = "normal" | "italic" | "oblique";

export type MarkupFontWeight =
  | "ultralight"
  | "light"
  | "normal"
  | "bold"
  | "ultrabold"
  | "heavy"
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900;

export type MarkupFontVariant =
  | "normal"
  | "small-caps"
  | "all-small-caps"
  | "petite-caps"
  | "all-petite-caps"
  | "unicase"
  | "title-caps";

export type MarkupFontStretch =
  | "ultracondensed"
  | "extracondensed"
  | "condensed"
  | "semicondensed"
  | "normal"
  | "semiexpanded"
  | "expanded";

export type MarkupFontUnderline =
  | "none"
  | "single"
  | "double"
  | "low"
  | "error";

export type MarkupFontOverline = "none" | "single";

export type MarkupFontScale = "superscript" | "subscript" | "small-caps";

export type MarkupFontGravity = "south" | "east" | "north" | "west" | "auto";

export type MarkupFontGravityHint = "natural" | "strong" | "line";

export type MarkupTextTransform =
  | "none"
  | "lowercase"
  | "uppercase"
  | "capitalize";

export type MarkupSegment = "word" | "sentence";

export interface MarkupElementProps {
  allowBreaks?: boolean;
  alpha?: number | `${number}%`;
  backgroundAlpha?: number | `${number}%`;
  backgroundColor?: string;
  baselineShift?: number;
  color?: string;
  fallback?: boolean;
  font?: string;
  fontFamily?: string;
  fontFeatures?: string;
  fontScale?: MarkupFontScale;
  fontSize?: MarkupFontSize;
  fontStretch?: MarkupFontStretch;
  fontStyle?: MarkupFontStyle;
  fontVariant?: MarkupFontVariant;
  fontWeight?: MarkupFontWeight;
  gravity?: MarkupFontGravity;
  gravityHint?: MarkupFontGravityHint;
  insertHyphens?: boolean;
  language?: string;
  letterSpacing?: number;
  lineHeight?: number;
  overline?: MarkupFontOverline;
  overlineColor?: string;
  rise?: number;
  segment?: MarkupSegment;
  show?: string;
  strikethrough?: boolean;
  strikethroughColor?: string;
  transform?: MarkupTextTransform;
  underline?: MarkupFontUnderline;
  underlineColor?: string;
}
