import { DataType } from "dilswer";
import Gtk from "gi://Gtk?version=3.0";
import Pango from "gi://Pango";
import type { EllipsizeMode, Justification, WrapMode } from "../../g-enums";
import type { GjsElement } from "../gjs-element";
import type { ElementMargin } from "../utils/apply-margin";
import type { DiffedProps } from "../utils/map-properties";
import { createPropMap } from "../utils/map-properties";
import type { AlignmentProps } from "../utils/property-maps-factories/create-alignment-prop-mapper";
import { createAlignmentPropMapper } from "../utils/property-maps-factories/create-alignment-prop-mapper";
import type { MarginProps } from "../utils/property-maps-factories/create-margin-prop-mapper";
import { createMarginPropMapper } from "../utils/property-maps-factories/create-margin-prop-mapper";

type LabelPropsMixin = AlignmentProps & MarginProps;

export interface LabelProps extends LabelPropsMixin {
  wrap?: boolean;
  wrapMode?: WrapMode;
  ellipsize?: EllipsizeMode;
  justify?: Justification;
  lines?: number;
  selectable?: boolean;
  children?: string | string[];
  margin?: ElementMargin;
}

export class LabelElement implements GjsElement<"LABEL"> {
  readonly kind = "LABEL";

  private widget = new Gtk.Label();
  private parent: Gtk.Container | null = null;

  private readonly propsMapper = createPropMap<LabelProps>(
    createAlignmentPropMapper(this.widget),
    createMarginPropMapper(this.widget),
    (props) =>
      props
        .wrap(DataType.Boolean, (v = true) => {
          this.widget.wrap = v;
        })
        .selectable(DataType.Boolean, (v = false) => {
          this.widget.selectable = v;
        })
        .lines(DataType.Number, (v = -1) => {
          this.widget.lines = v;
        })
        .ellipsize(
          DataType.Enum(Pango.EllipsizeMode),
          (v = Pango.EllipsizeMode.NONE) => {
            this.widget.ellipsize = v;
          }
        )
        .wrapMode(DataType.Enum(Pango.WrapMode), (v = Pango.WrapMode.CHAR) => {
          this.widget.wrap_mode = v;
        })
        .justify(
          DataType.Enum(Gtk.Justification),
          (v = Gtk.Justification.CENTER) => {
            this.widget.justify = v;
          }
        )
        .children(
          DataType.OneOf(DataType.String, DataType.ArrayOf(DataType.String)),
          (v = "") => {
            this.appendChild(v);
          }
        )
  );

  constructor(props: any) {
    this.updateProps(props);
  }

  appendTo(parent: Gtk.Container): void {
    parent.add(this.widget);
    this.parent = parent;
  }

  appendChild(child: GjsElement<any> | string | string[]): void {
    if (typeof child === "string") {
      this.widget.set_text(child);
    } else if (
      Array.isArray(child) &&
      child.every((c) => typeof c === "string")
    ) {
      let text = "";

      for (let i = 0; i < child.length; i++) {
        const subtext = child[i];
        text += subtext;
      }

      this.widget.set_text(text);
    } else {
      throw new TypeError("Label can only have text as it's children.");
    }
  }

  remove(parent: GjsElement<any>): void {
    this.propsMapper.cleanupAll();
    this.widget.destroy();
  }

  updateProps(props: DiffedProps): void {
    this.propsMapper.update(props);
  }

  render() {
    this.parent?.show_all();
  }
}
