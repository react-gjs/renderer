import type GdkPixbuf from "gi://GdkPixbuf";
import type Gtk from "gi://Gtk?version=3.0";
import type { GjsElement } from "../../gjs-element";
import type { MarkupAttributes } from "../../utils/markup-attributes";
import type { TextViewElement } from "./text-view";
import type { TextViewImageElement } from "./text-view-elements/text-view-image";
import type { TextViewLinkElement } from "./text-view-elements/text-view-link";

export interface TextViewTextNode {
  type: "TEXT";
  children: Array<string>;
}

export interface TextViewSpanNode {
  type: "SPAN";
  attributes: MarkupAttributes;
  children: Array<TextViewNode>;
}

export interface TextViewLinkNode {
  type: "LINK";
  attributes: MarkupAttributes;
  href: string;
  children: Array<TextViewNode>;
}

export interface TextViewImageNode {
  type: "IMAGE";
  children: [GdkPixbuf.Pixbuf];
}

export interface TextViewWidgetNode {
  type: "WIDGET";
  children: [Gtk.Widget];
}

export type TextViewNode =
  | TextViewSpanNode
  | TextViewTextNode
  | TextViewImageNode
  | TextViewLinkNode
  | TextViewWidgetNode;

export interface ITextViewElement extends GjsElement {
  getTextView(): TextViewElement | undefined;
  toNode(): TextViewNode;
}

export type TextViewElementContainer =
  | TextViewImageElement
  | TextViewElement
  | TextViewLinkElement;
