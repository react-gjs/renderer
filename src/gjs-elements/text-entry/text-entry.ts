import { DataType } from "dilswer";
import Gtk from "gi://Gtk?version=3.0";
import type { GjsElement } from "../gjs-element";
import type { MarginProp } from "../utils/apply-margin";
import { applyMargin, MarginDataType } from "../utils/apply-margin";
import { EventHandlers } from "../utils/event-handlers";
import type { DiffedProps } from "../utils/map-properties";
import { createPropMap } from "../utils/map-properties";

export type TextEntryProps = {
  value?: string;
  margin?: MarginProp;
  verticalAlign?: Gtk.Align;
  horizontalAlign?: Gtk.Align;
  onChange?: (value: string) => void;
  onKeyPress?: () => void;
};

export class TextEntryElement implements GjsElement {
  readonly kind = "TEXT_ENTRY";

  private textBuffer = new Gtk.EntryBuffer();
  private widget = new Gtk.Entry({
    buffer: this.textBuffer,
    visible: true,
  });
  private parent: Gtk.Container | null = null;

  private readonly handlers = new EventHandlers<Gtk.Entry, TextEntryProps>(
    this.widget
  );

  private readonly mapProps = createPropMap<TextEntryProps>((props) =>
    props
      .value(DataType.String, (v = "") => {
        this.widget.set_text(v);
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
    this.handlers.bind("changed", "onChange", () => [this.widget.text]);
    this.handlers.bind("key-press-event", "onKeyPress");

    this.updateProps(props);
  }

  appendTo(parent: Gtk.Container): void {
    parent.add(this.widget);
    this.parent = parent;
  }

  appendChild(child: GjsElement | string): void {
    throw new Error("Text Entry cannot have children.");
  }

  remove(parent: GjsElement): void {
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
