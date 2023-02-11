import type { GjsElement } from "../gjs-element";
import { GjsElementManager } from "../gjs-element-manager";
import type { TextNode } from "../gtk3/markup/text-node";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Gtk from "gi://Gtk";

export const isGjsElementOrString = (
  element: any
): element is GjsElement | TextNode => {
  return (
    GjsElementManager.isGjsElement(element) || element.kind === "TEXT_NODE"
  );
};
