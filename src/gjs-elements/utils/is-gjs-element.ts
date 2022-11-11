import type { GjsElement } from "../gjs-element";

export const isGjsElement = (element: any): element is GjsElement => {
  return (
    typeof element === "object" &&
    element !== null &&
    "kind" in element &&
    (element.kind === "WINDOW" ||
      element.kind === "BUTTON" ||
      element.kind === "BOX" ||
      element.kind === "LABEL")
  );
};

export const isGjsElementOrString = (
  element: any
): element is GjsElement | string => {
  return isGjsElement(element) || typeof element === "string";
};
