import type { GjsElement } from "../gjs-element";
import { GjsElementManager } from "../gjs-element-manager";
import { TextNode } from "../gtk3/text-node";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Gtk from "gi://Gtk";

export const isGjsElementOrText = (
  element: any
): element is GjsElement | TextNode => {
  return (
    GjsElementManager.isGjsElement(element) || TextNode.isTextNode(element)
  );
};
