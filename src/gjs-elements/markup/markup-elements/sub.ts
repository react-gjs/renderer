import type { MarkupElementProps } from "../markup-elem";
import { MSpanElement } from "./span";

export type MSubProps = MarkupElementProps;

export class MSubElement extends MSpanElement {
  readonly kind = "M_SUBSCRIPT";

  stringify(): string {
    const content = this.children.flatMap(this.mapChild).join("");

    return `<sub${this.attributes.stringify()}>${content}</sub>`;
  }
}
