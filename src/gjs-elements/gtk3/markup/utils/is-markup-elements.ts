import type { GjsElement } from "../../../gjs-element";
import type { TextNode } from "../../text-node";
import type { BaseMarkupElement } from "../markup-elem";

export const isMarkupElement = (
  v: string | string[] | TextNode | GjsElement,
): v is TextNode | BaseMarkupElement => {
  if (typeof v === "string" || Array.isArray(v)) {
    return false;
  }

  v = v as GjsElement | TextNode;

  return (
    v.kind === "TEXT_NODE" ||
    v.kind === "M_SPAN" ||
    v.kind === "M_BIG" ||
    v.kind === "M_SMALL" ||
    v.kind === "M_BOLD" ||
    v.kind === "M_ITALIC" ||
    v.kind === "M_MONOSPACE" ||
    v.kind === "M_UNDERLINE" ||
    v.kind === "M_STRIKETHROUGH" ||
    v.kind === "M_SUPERSCRIPT" ||
    v.kind === "M_SUBSCRIPT" ||
    v.kind === "M_ANCHOR"
  );
};
