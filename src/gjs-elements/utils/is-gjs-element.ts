import type { GjsElement } from "../gjs-element";
import { GjsElementManager } from "../gjs-element-manager";

export const isGjsElementOrString = (
  element: any
): element is GjsElement<any> | string => {
  return GjsElementManager.isGjsElement(element) || typeof element === "string";
};
