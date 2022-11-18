import { DataType } from "dilswer";
import Gtk from "gi://Gtk";
import type { GjsElement } from "../gjs-element";
import { ensureNotString } from "../utils/ensure-not-string";
import type { SyntheticEvent } from "../utils/event-handlers";
import { EventHandlers } from "../utils/event-handlers";
import type { DiffedProps } from "../utils/map-properties";
import { createPropMap } from "../utils/map-properties";
import { ChildOrderController } from "../utils/widget-operations/child-order-controller";

export type WindowProps = {
  title?: string;
  defaultWidth?: number;
  defaultHeight?: number;
  onDestroy?: (event: SyntheticEvent) => void;
  onDragBegin?: (event: SyntheticEvent) => void;
  onDragEnd?: (event: SyntheticEvent) => void;
  onFocus?: (event: SyntheticEvent) => void;
  onHide?: (event: SyntheticEvent) => void;
  onResize?: (event: SyntheticEvent<{ width: number; height: number }>) => void;
};

export class WindowElement implements GjsElement<"WINDOW", Gtk.Window> {
  readonly kind = "WINDOW";

  private parent: GjsElement | null = null;
  widget = new Gtk.Window();
  private children = new ChildOrderController(Gtk.Window, this.widget);

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
    this.handlers.bind("configure-event", "onResize", () => ({
      width: this.widget.get_allocated_width(),
      height: this.widget.get_allocated_height(),
    }));

    this.updateProps(props);
  }

  notifyWillAppendTo(parent: GjsElement): void {
    this.parent = parent;
  }

  appendChild(child: string | GjsElement): void {
    ensureNotString(child);

    child.notifyWillAppendTo(this);
    this.children.addChild(child);
  }

  updateProps(props: DiffedProps): void {
    this.propsMapper.update(props);
    this.handlers.update(props);
  }

  notifyWillUnmount(child: GjsElement): void {
    this.children.removeChild(child);
  }

  remove(parent: GjsElement): void {
    parent.notifyWillUnmount(this);

    this.propsMapper.cleanupAll();
    this.handlers.unbindAll();
    this.widget.destroy();
  }

  render(): void {
    this.widget.show_all();
  }

  insertBefore(newChild: GjsElement | string, beforeChild: GjsElement): void {
    ensureNotString(newChild);

    newChild.notifyWillAppendTo(this);
    this.children.insertBefore(newChild, beforeChild);
    this.widget.show_all();
  }
}
