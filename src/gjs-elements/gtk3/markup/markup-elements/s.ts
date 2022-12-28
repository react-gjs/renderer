import type { MarkupElementProps } from "../markup-elem";
import { MSpanElement } from "./span";

export type MStrikethroughProps = MarkupElementProps;

export class MStrikethroughElement extends MSpanElement {
  readonly kind = "M_STRIKETHROUGH";

  stringify(): string {
    const content = this.children.flatMap(this.mapChild).join("");

    return `<s${this.attributes.stringify()}>${content}</s>`;
  }
}
