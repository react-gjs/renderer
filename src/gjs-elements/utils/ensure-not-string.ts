import type { TextNode } from "../markup/text-node";

export function ensureNotString<T>(
  value: T | TextNode | string
): asserts value is T {
  if (typeof value === "string" || (value as TextNode).kind === "TEXT_NODE") {
    throw new Error("This element can't have strings as it's children.");
  }
}
