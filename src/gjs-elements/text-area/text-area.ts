import { DataType } from "dilswer";
import Gtk from "gi://Gtk?version=3.0";
import type { GjsElement } from "../gjs-element";
import type { MarginProp } from "../utils/apply-margin";
import { applyMargin, MarginDataType } from "../utils/apply-margin";
import { EventHandlers } from "../utils/event-handlers";
import { getStrByteSize } from "../utils/get-str-byte-size";
import type { DiffedProps } from "../utils/map-properties";
import { createPropMap } from "../utils/map-properties";

export type TextAreaProps = {
  value?: string;
  margin?: MarginProp;
  verticalAlign?: Gtk.Align;
  horizontalAlign?: Gtk.Align;
  onChange?: (value: string) => void;
  onKeyPress?: () => void;
};

export class TextAreaElement implements GjsElement<"TEXT_AREA"> {
  readonly kind = "TEXT_AREA";

  private textBuffer = new Gtk.TextBuffer();
  private widget = new Gtk.TextView({
    buffer: this.textBuffer,
    vexpand: true,
  });
  private parent: Gtk.Container | null = null;

  private readonly handlers = new EventHandlers<Gtk.TextView, TextAreaProps>(
    this.widget
  );

  private readonly mapProps = createPropMap<TextAreaProps>((props) =>
    props
      .value(DataType.String, (v = "") => {
        this.widget.get_buffer().set_text(v, getStrByteSize(v));
      })
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
    let lastText = props.value ?? "";

    this.handlers.bind("key-release-event", "onChange", () => {
      const currentText = this.widget.get_buffer().text;
      if (currentText !== lastText) {
        lastText = currentText;
        return [currentText];
      }
      throw new Error("no-op");
    });

    this.handlers.bind("key-press-event", "onKeyPress");

    this.updateProps(props);
  }

  appendTo(parent: Gtk.Container): void {
    parent.add(this.widget);
    this.parent = parent;
  }

  appendChild(child: GjsElement<any> | string): void {
    throw new Error("Text Area cannot have children.");
  }

  remove(parent: GjsElement<any>): void {
    this.handlers.unbindAll();
    this.widget.destroy();
  }

  updateProps(props: DiffedProps): void {
    this.mapProps(props);
    this.handlers.update(props);
  }

  render() {
    this.parent?.show_all();
  }
}
