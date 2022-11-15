import { DataType } from "dilswer";
import Gtk from "gi://Gtk?version=3.0";
import type { GjsElement } from "../gjs-element";
import { EventHandlers } from "../utils/event-handlers";
import type { DiffedProps } from "../utils/map-properties";
import { createPropMap } from "../utils/map-properties";

export type WindowProps = {
  title?: string;
  defaultWidth?: number;
  defaultHeight?: number;
  onDestroy?: () => void;
  onDragBegin?: () => void;
  onDragEnd?: () => void;
  onFocus?: () => void;
  onHide?: () => void;
  onResize?: (width: number, height: number) => void;
};

export class WindowElement implements GjsElement<"WINDOW"> {
  readonly kind = "WINDOW";

  private widget = new Gtk.Window();
  private parent: Gtk.Container | null = null;

  private readonly handlers = new EventHandlers(this.widget);

  private readonly propsMapper = createPropMap<WindowProps>((props) =>
    props
      .title(DataType.String, (v = "") => {
        this.widget.title = v;
      })
      .defaultWidth(DataType.Number, (v = -1) => {
        this.widget.default_width = v;
      })
      .defaultHeight(DataType.Number, (v = -1) => {
        this.widget.default_height = v;
      })
  );

  constructor(props: any) {
    this.handlers.bind("destroy", "onDestroy");
    this.handlers.bind("drag-begin", "onDragBegin");
    this.handlers.bind("drag-end", "onDragEnd");
    this.handlers.bind("focus", "onFocus");
    this.handlers.bind("hide", "onHide");
    this.handlers.bind("configure-event", "onResize", () => [
      this.widget.get_allocated_width(),
      this.widget.get_allocated_height(),
    ]);

    this.updateProps(props);
  }

  appendTo(parent: Gtk.Container): void {
    this.parent = parent;
  }

  appendChild(child: string | GjsElement<any>): void {
    if (typeof child === "string") {
      throw new Error("Window can only have other elements as it's children.");
    }

    child.appendTo(this.widget);
  }

  updateProps(props: DiffedProps): void {
    this.propsMapper.update(props);
    this.handlers.update(props);
  }

  remove(parent: GjsElement<any>): void {
    this.propsMapper.cleanupAll();
    this.handlers.unbindAll();
    this.widget.destroy();
  }

  render(): void {
    this.widget.show_all();
  }
}
