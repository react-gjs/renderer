import type { MarkupElementProps } from "../markup-elem";
import { MSpanElement } from "./span";

export type MSupProps = MarkupElementProps;

export class MSupElement extends MSpanElement {
  readonly kind = "M_SUPERSCRIPT";

  stringify(): string {
    const content = this.children.flatMap(this.mapChild).join("");

    return `<sup${this.attributes.stringify()}>${content}</sup>`;
  }
}
