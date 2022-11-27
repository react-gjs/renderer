import type { MarkupElementProps } from "../markup-elem";
import { MSpanElement } from "./span";

export type MItalicProps = MarkupElementProps;

export class MItalicElement extends MSpanElement {
  readonly kind = "M_ITALIC";

  stringify(): string {
    const content = this.children.flatMap(this.mapChild).join("");

    return `<i${this.attributes.stringify()}>${content}</i>`;
  }
}
