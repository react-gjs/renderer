import type { GjsElement } from "../gjs-element";
import { GjsElementManager } from "../gjs-element-manager";

export const isGjsElementOrString = (
  element: any
): element is GjsElement | string => {
  return (
    GjsElementManager.isGjsElement(element) ||
    typeof element === "string" ||
    element.kind === "TEXT_NODE"
  );
};
