import type { GjsElement } from "../gjs-element";
import { GjsElementManager } from "../gjs-element-manager";
import type { TextNode } from "../markup/text-node";

export const isGjsElementOrString = (
  element: any
): element is GjsElement | TextNode => {
  return (
    GjsElementManager.isGjsElement(element) || element.kind === "TEXT_NODE"
  );
};
