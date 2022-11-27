import type { MarkupElementProps } from "../markup-elem";
import { MSpanElement } from "./span";

export type MMonospaceProps = MarkupElementProps;

export class MMonospaceElement extends MSpanElement {
  readonly kind = "M_MONOSPACE";

  stringify(): string {
    const content = this.children.flatMap(this.mapChild).join("");

    return `<tt${this.attributes.stringify()}>${content}</tt>`;
  }
}
