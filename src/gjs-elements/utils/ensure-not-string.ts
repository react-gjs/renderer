import type { TextNode } from "../gtk3/text-node";

export function ensureNotText<T>(
  value: T | TextNode | string,
): asserts value is T {
  if (
    typeof value === "string" ||
    (value as TextNode).kind === "TEXT_NODE"
  ) {
    throw new Error("This element can't have text as it's children.");
  }
}
