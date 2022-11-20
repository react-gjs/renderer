import { DataType } from "dilswer";
import Gtk from "gi://Gtk";
import { diffProps } from "../../reconciler/diff-props";
import type { GjsElement } from "../gjs-element";
import { ChildOrderController } from "../utils/element-extenders/child-order-controller";
import { ElementLifecycleController } from "../utils/element-extenders/element-lifecycle-controller";
import type { SyntheticEvent } from "../utils/element-extenders/event-handlers";
import { EventHandlers } from "../utils/element-extenders/event-handlers";
import type { DiffedProps } from "../utils/element-extenders/map-properties";
import { PropertyMapper } from "../utils/element-extenders/map-properties";
import { ensureNotString } from "../utils/ensure-not-string";

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
  widget = new Gtk.Window();

  private parent: GjsElement | null = null;

  private readonly lifecycle = new ElementLifecycleController();
  private readonly children = new ChildOrderController(
    this.lifecycle,
    this.widget
  );
  private readonly handlers = new EventHandlers(this.lifecycle, this.widget);
  private readonly propsMapper = new PropertyMapper<WindowProps>(
    this.lifecycle,
    (props) =>
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

    this.lifecycle.emitLifecycleEventAfterCreate();
  }

  updateProps(props: DiffedProps): void {
    this.lifecycle.emitLifecycleEventUpdate(props);
  }

  // #region This widget direct mutations

  appendChild(child: string | GjsElement): void {
    ensureNotString(child);

    child.notifyWillAppendTo(this);
    this.children.addChild(child);
  }

  insertBefore(newChild: GjsElement | string, beforeChild: GjsElement): void {
    ensureNotString(newChild);

    newChild.notifyWillAppendTo(this);
    this.children.insertBefore(newChild, beforeChild);
    this.widget.show_all();
  }

  remove(parent: GjsElement): void {
    parent.notifyWillUnmount(this);

    this.lifecycle.emitLifecycleEventBeforeDestroy();

    this.widget.destroy();
  }

  render(): void {
    this.widget.show_all();
  }

  // #endregion

  // #region Element internal signals

  notifyWillAppendTo(parent: GjsElement): void {
    this.parent = parent;
  }

  notifyWillUnmount(child: GjsElement): void {
    this.children.removeChild(child);
  }

  // #endregion

  // #region Utils for external use

  diffProps(
    oldProps: Record<string, any>,
    newProps: Record<string, any>
  ): DiffedProps {
    return diffProps(oldProps, newProps, true);
  }

  // #endregion
}
