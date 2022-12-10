import { DataType } from "dilswer";
import Gtk from "gi://Gtk";
import type { GjsContext } from "../../reconciler/gjs-renderer";
import type { HostContext } from "../../reconciler/host-context";
import type { GjsElement } from "../gjs-element";
import type { TextNode } from "../markup/text-node";
import { diffProps } from "../utils/diff-props";
import { ChildOrderController } from "../utils/element-extenders/child-order-controller";
import { ElementLifecycleController } from "../utils/element-extenders/element-lifecycle-controller";
import type { DiffedProps } from "../utils/element-extenders/map-properties";
import { PropertyMapper } from "../utils/element-extenders/map-properties";
import { ensureNotString } from "../utils/ensure-not-string";

export interface RevealerProps {
  visible?: boolean;
  transitionDuration?: number;
  transitionType?: Gtk.RevealerTransitionType;
}

export class RevealerElement implements GjsElement<"REVEALER", Gtk.Revealer> {
  static getContext(
    currentContext: HostContext<GjsContext>
  ): HostContext<GjsContext> {
    return currentContext;
  }

  readonly kind = "REVEALER";
  widget = new Gtk.Revealer();

  private parent: GjsElement | null = null;

  private readonly lifecycle = new ElementLifecycleController();
  private readonly children = new ChildOrderController(
    this.lifecycle,
    this.widget
  );
  private readonly propsMapper = new PropertyMapper<RevealerProps>(
    this.lifecycle,
    (props) =>
      props
        .visible(DataType.Boolean, (v = false) => {
          this.widget.reveal_child = v;
        })
        .transitionDuration(DataType.Number, (v = 500) => {
          this.widget.transition_duration = v;
        })
        .transitionType(
          DataType.Enum(Gtk.RevealerTransitionType),
          (v = Gtk.RevealerTransitionType.NONE) => {
            this.widget.transition_type = v;
          }
        )
  );

  constructor(props: DiffedProps) {
    this.updateProps(props);

    this.lifecycle.emitLifecycleEventAfterCreate();
  }

  updateProps(props: DiffedProps): void {
    this.lifecycle.emitLifecycleEventUpdate(props);
  }

  // #region This widget direct mutations

  appendChild(child: GjsElement | TextNode): void {
    ensureNotString(child);

    child.notifyWillAppendTo(this);
    this.children.addChild(child);
    this.widget.show_all();
  }

  insertBefore(newChild: GjsElement | TextNode, beforeChild: GjsElement): void {
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

  render() {
    this.parent?.widget.show_all();
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
