import { DataType } from "dilswer";
import Gtk from "gi://Gtk?version=3.0";
import Pango from "gi://Pango";
import type { GjsElement } from "../gjs-element";
import type { MarginProp } from "../utils/apply-margin";
import { applyMargin, MarginDataType } from "../utils/apply-margin";
import type { DiffedProps } from "../utils/map-properties";
import { createPropMap } from "../utils/map-properties";

export type LabelProps = {
  wrap?: boolean;
  wrapMode?: Pango.WrapMode;
  ellipsize?: Pango.EllipsizeMode;
  justify?: Gtk.Justification;
  verticalAlign?: Gtk.Align;
  horizontalAlign?: Gtk.Align;
  lines?: number;
  selectable?: boolean;
  children?: string | string[];
  margin?: MarginProp;
};

export class LabelElement implements GjsElement {
  readonly kind = "LABEL";

  private widget = new Gtk.Label();
  private parent: Gtk.Container | null = null;

  private readonly mapProps = createPropMap<LabelProps>((props) =>
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
      .margin(MarginDataType, (v = 0) => {
        applyMargin(this.widget, v);
      })
      .verticalAlign(DataType.Enum(Gtk.Align), (v = Gtk.Align.START) => {
        this.widget.valign = v;
      })
      .horizontalAlign(DataType.Enum(Gtk.Align), (v = Gtk.Align.START) => {
        this.widget.halign = v;
      })
  );

  constructor(props: any) {
    this.updateProps(props);
  }

  appendTo(parent: Gtk.Container): void {
    parent.add(this.widget);
    this.parent = parent;
  }

  appendChild(child: GjsElement | string | string[]): void {
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

  remove(parent: GjsElement): void {
    this.widget.destroy();
  }

  updateProps(props: DiffedProps): void {
    this.mapProps(props);
  }

  render() {
    this.parent?.show_all();
  }
}
