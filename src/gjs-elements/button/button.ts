import { DataType } from "dilswer";
import Gtk from "gi://Gtk?version=3.0";
import type { GjsElement } from "../gjs-element";
import type { MarginProp } from "../utils/apply-margin";
import { applyMargin, MarginDataType } from "../utils/apply-margin";
import { EventHandlers } from "../utils/event-handlers";
import type { DiffedProps } from "../utils/map-properties";
import { createPropMap } from "../utils/map-properties";

export type ButtonProps = {
  label?: string;
  image?: Gtk.Widget;
  imagePosition?: Gtk.PositionType;
  useUnderline?: boolean;
  margin?: MarginProp;
  verticalAlign?: Gtk.Align;
  horizontalAlign?: Gtk.Align;
  onClick?: () => void;
  onActivate?: () => void;
  onEnter?: () => void;
  onLeave?: () => void;
  onPressed?: () => void;
  onReleased?: () => void;
};

const WidgetDataType = DataType.Custom(
  (v: any): v is Gtk.Widget => typeof v === "object"
);

export class ButtonElement implements GjsElement {
  readonly kind = "BUTTON";

  private widget = new Gtk.Button();
  private parent: Gtk.Container | null = null;

  private readonly handlers = new EventHandlers<Gtk.Button, ButtonProps>(
    this.widget
  );

  private readonly mapProps = createPropMap<ButtonProps>((props) =>
    props
      .label(DataType.String, (v = "") => {
        this.widget.label = v;
      })
      .image(WidgetDataType, (v) => {
        this.widget.set_image(v ?? null);
      })
      .imagePosition(
        DataType.Enum(Gtk.PositionType),
        (v = Gtk.PositionType.LEFT) => {
          this.widget.image_position = v;
        }
      )
      .useUnderline(DataType.Boolean, (v = false) => {
        this.widget.use_underline = v;
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
    this.handlers.bind("clicked", "onClick");
    this.handlers.bind("activate", "onActivate");
    this.handlers.bind("enter", "onEnter");
    this.handlers.bind("leave", "onLeave");
    this.handlers.bind("pressed", "onPressed");
    this.handlers.bind("released", "onReleased");

    this.updateProps(props);
  }

  appendTo(parent: Gtk.Container): void {
    parent.add(this.widget);
    this.parent = parent;
  }

  appendChild(child: string | GjsElement): void {
    if (typeof child === "string") {
      this.widget.label = child;
    } else {
      child.appendTo(this.widget);
    }
    this.widget.show_all();
  }

  updateProps(props: DiffedProps): void {
    this.mapProps(props);
    this.handlers.update(props);
  }

  remove(parent: GjsElement): void {
    this.handlers.unbindAll();
    this.widget.destroy();
  }

  render() {
    this.parent?.show_all();
  }
}
