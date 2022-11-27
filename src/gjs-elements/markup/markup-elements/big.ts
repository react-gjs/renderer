import type { MarkupElementProps } from "../markup-elem";
import { MSpanElement } from "./span";

export type MBigProps = MarkupElementProps;

export class MBigElement extends MSpanElement {
  readonly kind = "M_BIG";

  stringify(): string {
    const content = this.children.flatMap(this.mapChild).join("");

    return `<big${this.attributes.stringify()}>${content}</big>`;
  }
}
