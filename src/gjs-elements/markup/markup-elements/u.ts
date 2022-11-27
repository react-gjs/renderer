import type { MarkupElementProps } from "../markup-elem";
import { MSpanElement } from "./span";

export type MUnderlineProps = MarkupElementProps;

export class MUnderlineElement extends MSpanElement {
  readonly kind = "M_UNDERLINE";

  stringify(): string {
    const content = this.children.flatMap(this.mapChild).join("");

    return `<u${this.attributes.stringify()}>${content}</u>`;
  }
}
