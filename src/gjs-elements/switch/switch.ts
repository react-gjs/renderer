import { DataType } from "dilswer";
import Gtk from "gi://Gtk?version=3.0";
import type { GjsElement } from "../gjs-element";
import type { MarginProp } from "../utils/apply-margin";
import { applyMargin, MarginDataType } from "../utils/apply-margin";
import { EventHandlers } from "../utils/event-handlers";
import type { DiffedProps } from "../utils/map-properties";
import { createPropMap } from "../utils/map-properties";

export type SwitchProps = {
  margin?: MarginProp;
  verticalAlign?: Gtk.Align;
  horizontalAlign?: Gtk.Align;
  value?: boolean;
  onToggle?: (value: boolean) => void;
};

export class SwitchElement implements GjsElement<"SWITCH"> {
  readonly kind = "SWITCH";

  private widget = new Gtk.Switch();
  private parent: Gtk.Container | null = null;

  private readonly handlers = new EventHandlers<Gtk.Switch, SwitchProps>(
    this.widget
  );

  private readonly mapProps = createPropMap<SwitchProps>((props) =>
    props
      .margin(MarginDataType, (v = 0) => {
        applyMargin(this.widget, v);
      })
      .verticalAlign(DataType.Enum(Gtk.Align), (v = Gtk.Align.START) => {
        this.widget.valign = v;
      })
      .horizontalAlign(DataType.Enum(Gtk.Align), (v = Gtk.Align.START) => {
        this.widget.halign = v;
      })
      .value(DataType.Boolean, (v = false) => {
        this.widget.set_state(v);
      })
  );

  constructor(props: any) {
    this.handlers.bind("state-changed", "onToggle", () => [this.widget.state]);

    this.updateProps(props);
  }

  appendTo(parent: Gtk.Container): void {
    parent.add(this.widget);
    this.parent = parent;
  }

  appendChild(child: string | GjsElement<any>): void {
    throw new Error("Switch does not support children.");
  }

  updateProps(props: DiffedProps): void {
    this.mapProps(props);
    this.handlers.update(props);
  }

  remove(parent: GjsElement<any>): void {
    this.handlers.unbindAll();
    this.widget.destroy();
  }

  render() {
    this.parent?.show_all();
  }
}
