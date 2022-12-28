import { DataType } from "dilswer";
import GdkPixbuf from "gi://GdkPixbuf";
import Gtk from "gi://Gtk";
import { WindowTypeHint } from "../../../g-enums";
import type { GjsContext } from "../../../reconciler/gjs-renderer";
import type { HostContext } from "../../../reconciler/host-context";
import type { GjsElement } from "../../gjs-element";
import { GjsElementManager } from "../../gjs-element-manager";
import { diffProps } from "../../utils/diff-props";
import { ChildOrderController } from "../../utils/element-extenders/child-order-controller";
import { ElementLifecycleController } from "../../utils/element-extenders/element-lifecycle-controller";
import type { SyntheticEvent } from "../../utils/element-extenders/event-handlers";
import { EventHandlers } from "../../utils/element-extenders/event-handlers";
import type { DiffedProps } from "../../utils/element-extenders/map-properties";
import { PropertyMapper } from "../../utils/element-extenders/map-properties";
import { ensureNotText } from "../../utils/ensure-not-string";
import { HeaderBarElement } from "../headerbar/headerbar";
import type { TextNode } from "../markup/text-node";

export type WindowProps = {
  decorate?: boolean;
  defaultHeight?: number;
  defaultWidth?: number;
  minHeight?: number;
  minWidth?: number;
  hideTitlebarWhenMaximized?: boolean;
  icon?: GdkPixbuf.Pixbuf;
  resizable?: boolean;
  showCloseButton?: boolean;
  title?: string;
  windowTypeHint?: WindowTypeHint;
  onDestroy?: (event: SyntheticEvent) => void;
  onDragBegin?: (event: SyntheticEvent) => void;
  onDragEnd?: (event: SyntheticEvent) => void;
  onFocus?: (event: SyntheticEvent) => void;
  onHide?: (event: SyntheticEvent) => void;
  onResize?: (event: SyntheticEvent<{ width: number; height: number }>) => void;
};

export class WindowElement implements GjsElement<"WINDOW", Gtk.Window> {
  static getContext(
    currentContext: HostContext<GjsContext>
  ): HostContext<GjsContext> {
    return currentContext;
  }

  readonly kind = "WINDOW";
  widget = new Gtk.Window();

  private parent: GjsElement | null = null;

  private readonly lifecycle = new ElementLifecycleController();
  private readonly children = new ChildOrderController(
    this.lifecycle,
    this.widget,
    this.addChild.bind(this)
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
        .minHeight(DataType.Number, (v = 0, allProps) => {
          this.widget.set_size_request(allProps.minWidth ?? 0, v);
        })
        .minWidth(DataType.Number, (v = 0, allProps) => {
          this.widget.set_size_request(v, allProps.minHeight ?? 0);
        })
        .decorate(DataType.Boolean, (v = true) => {
          this.widget.decorated = v;
        })
        .hideTitlebarWhenMaximized(DataType.Boolean, (v = true) => {
          this.widget.hide_titlebar_when_maximized = v;
        })
        .resizable(DataType.Boolean, (v = true) => {
          this.widget.resizable = v;
        })
        .showCloseButton(DataType.Boolean, (v = true) => {
          this.widget.deletable = v;
        })
        .windowTypeHint(
          DataType.Enum(WindowTypeHint),
          (v = WindowTypeHint.NORMAL) => {
            this.widget.type_hint = v;
          }
        )
        .icon(DataType.RecordOf({}), (v) => {
          if (v) {
            if (v instanceof GdkPixbuf.Pixbuf) {
              this.widget.icon = v;
              return;
            }
          }

          this.widget.set_icon(null);
        })
  );

  constructor(props: DiffedProps) {
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

  private addChild(widget: Gtk.Widget, element: GjsElement, index: number) {
    if (
      index === 0 &&
      GjsElementManager.isGjsElementOfKind(element, HeaderBarElement)
    ) {
      this.widget.set_titlebar(widget);
    } else {
      this.widget.add(widget);
    }
  }

  updateProps(props: DiffedProps): void {
    this.lifecycle.emitLifecycleEventUpdate(props);
  }

  // #region This widget direct mutations

  appendChild(child: GjsElement | TextNode): void {
    ensureNotText(child);

    child.notifyWillAppendTo(this);
    this.children.addChild(child);
  }

  insertBefore(newChild: GjsElement | TextNode, beforeChild: GjsElement): void {
    ensureNotText(newChild);

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

  show() {
    this.widget.visible = true;
  }

  hide() {
    this.widget.visible = false;
  }

  diffProps(
    oldProps: Record<string, any>,
    newProps: Record<string, any>
  ): DiffedProps {
    return diffProps(oldProps, newProps, true);
  }

  // #endregion
}
