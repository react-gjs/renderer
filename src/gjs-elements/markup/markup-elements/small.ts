import type { MarkupElementProps } from "../markup-elem";
import { MSpanElement } from "./span";

export type MSmallProps = MarkupElementProps;

export class MSmallElement extends MSpanElement {
  readonly kind = "M_SMALL";

  stringify(): string {
    const content = this.children.flatMap(this.mapChild).join("");

    return `<small${this.attributes.stringify()}>${content}</small>`;
  }
}
