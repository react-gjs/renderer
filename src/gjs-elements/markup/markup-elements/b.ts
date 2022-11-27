import type { MarkupElementProps } from "../markup-elem";
import { MSpanElement } from "./span";

export type MBoldProps = MarkupElementProps;

export class MBoldElement extends MSpanElement {
  readonly kind = "M_BOLD";

  stringify(): string {
    const content = this.children.flatMap(this.mapChild).join("");

    return `<b${this.attributes.stringify()}>${content}</b>`;
  }
}
