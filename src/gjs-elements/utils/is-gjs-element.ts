import type { GjsElement } from "../gjs-element";

export const GjsElementKinds = [
  "WINDOW",
  "BUTTON",
  "BOX",
  "LABEL",
  "APPLICATION",
  "TEXT_ENTRY",
  "TEXT_AREA",
];

export const isGjsElement = (element: any): element is GjsElement => {
  return (
    typeof element === "object" &&
    element !== null &&
    "kind" in element &&
    GjsElementKinds.includes(element.kind)
  );
};

export const isGjsElementOrString = (
  element: any
): element is GjsElement | string => {
  return isGjsElement(element) || typeof element === "string";
};
