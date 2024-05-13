import { DataType } from "dilswer";
import type { GjsContext } from "../../../../reconciler/gjs-renderer";
import type { HostContext } from "../../../../reconciler/host-context";
import type { DiffedProps, PropertyMapper } from "../../../utils/element-extenders/map-properties";
import type { MarkupElementProps } from "../markup-elem";
import { MSpanElement } from "./span";

export type MAnchorProps = MarkupElementProps & {
  href: string;
};

export class MAnchorElement extends MSpanElement {
  readonly kind = "M_ANCHOR";

  constructor(props: DiffedProps, context: HostContext<GjsContext>) {
    super(props, context, (self: MAnchorElement) => {
      const props = self.propsMapper as any as PropertyMapper<MAnchorProps>;
      props.addCases((props) =>
        props.href(DataType.String, (v) => {
          if (v) self.attributes.set("href", v.toString());
          else self.attributes.delete("href");
        })
      );
    });
  }

  stringify(): string {
    const content = this.children.flatMap(this.mapChild).join("");

    return `<a${this.attributes.stringify()}>${content}</a>`;
  }
}
