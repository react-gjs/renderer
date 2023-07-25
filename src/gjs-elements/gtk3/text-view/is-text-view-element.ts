import type { GjsElement } from "../../gjs-element";
import { GjsElementManager } from "../../gjs-element-manager";
import type { TextNode } from "../text-node";
import { TextViewElement } from "./text-view";
import type {
  ITextViewElement,
  TextViewElementContainer,
} from "./text-view-elem-interface";
import { TextViewLinkElement } from "./text-view-elements/text-view-link";

export const isTextViewElement = (
  element: GjsElement | TextNode,
): element is ITextViewElement => {
  return (
    element.kind === "TEXT_VIEW_SPAN" ||
    element.kind === "TEXT_VIEW_IMAGE" ||
    element.kind === "TEXT_VIEW_LINK" ||
    element.kind === "TEXT_VIEW_WIDGET" ||
    element.kind === "TEXT_NODE"
  );
};

export const isTextViewElementContainer = (
  element: GjsElement,
): element is TextViewElementContainer => {
  return GjsElementManager.isGjsElementOfKind(element, [
    TextViewElement,
    TextViewLinkElement,
    TextViewLinkElement,
  ]);
};
