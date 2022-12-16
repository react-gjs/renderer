import { DataType } from "dilswer";
import type Gtk from "gi://Gtk";
import { StackTransitionType } from "../../g-enums";
import type { GjsContext } from "../../reconciler/gjs-renderer";
import type { HostContext } from "../../reconciler/host-context";
import type { GjsElement } from "../gjs-element";
import { GjsElementManager } from "../gjs-element-manager";
import type { TextNode } from "../markup/text-node";
import { diffProps } from "../utils/diff-props";
import { ChildOrderController } from "../utils/element-extenders/child-order-controller";
import { ElementLifecycleController } from "../utils/element-extenders/element-lifecycle-controller";
import type { DiffedProps } from "../utils/element-extenders/map-properties";
import { PropertyMapper } from "../utils/element-extenders/map-properties";
import { ensureNotText } from "../utils/ensure-not-string";
import type { AlignmentProps } from "../utils/property-maps-factories/create-alignment-prop-mapper";
import { createAlignmentPropMapper } from "../utils/property-maps-factories/create-alignment-prop-mapper";
import type { MarginProps } from "../utils/property-maps-factories/create-margin-prop-mapper";
import { createMarginPropMapper } from "../utils/property-maps-factories/create-margin-prop-mapper";
import { StackScreenElement } from "./stack-screen";

type StackPropsMixin = AlignmentProps & MarginProps;

export interface StackProps extends StackPropsMixin {
  transitionDuration?: number;
  transitionType?: StackTransitionType;
  interpolateSize?: boolean;
  sameSize?: boolean;
  children?: React.ReactElement | React.ReactElement[];
}

export class StackElement implements GjsElement<"STACK", Gtk.Stack> {
  static getContext(
    currentContext: HostContext<GjsContext>
  ): HostContext<GjsContext> {
    return currentContext;
  }

  readonly kind = "STACK";
  widget: Gtk.Stack;

  private parent: GjsElement | null = null;

  private readonly lifecycle = new ElementLifecycleController();
  private readonly children: ChildOrderController<StackScreenElement>;
  private readonly propsMapper = new PropertyMapper<StackProps>(this.lifecycle);

  constructor(props: DiffedProps) {
    const widget = props.find(([name]) => name === "_widget")?.[1] as
      | Gtk.Stack
      | undefined;

    if (!widget) {
      throw new Error("Stack must be created with a _widget prop.");
    }

    this.widget = widget;

    this.children = new ChildOrderController(
      this.lifecycle,
      this.widget,
      (widget, child) => {
        const label = child.label;
        const uniqueName = child.uid;

        this.widget.add_titled(widget, uniqueName, label);
      }
    );

    this.propsMapper.addCases(
      createAlignmentPropMapper(this.widget),
      createMarginPropMapper(this.widget),
      (props) =>
        props
          .interpolateSize(DataType.Boolean, (v = false) => {
            this.widget.set_interpolate_size(v);
          })
          .sameSize(DataType.Boolean, (v = false) => {
            this.widget.set_homogeneous(v);
          })
          .transitionDuration(DataType.Int, (v = 250) => {
            this.widget.set_transition_duration(v);
          })
          .transitionType(
            DataType.Enum(StackTransitionType),
            (v = StackTransitionType.CROSSFADE) => {
              this.widget.set_transition_type(v);
            }
          )
    );

    this.updateProps(props);

    this.lifecycle.emitLifecycleEventAfterCreate();
  }

  updateProps(props: DiffedProps): void {
    this.lifecycle.emitLifecycleEventUpdate(props);
  }

  // #region This widget direct mutations

  appendChild(child: GjsElement | TextNode): void {
    ensureNotText(child);

    if (!GjsElementManager.isGjsElementOfKind(child, StackScreenElement)) {
      throw new Error("Stack can only have StackItem's as it's children.");
    }

    child.notifyWillAppendTo(this);
    this.children.addChild(child);
    this.widget.show_all();
  }

  insertBefore(newChild: GjsElement | TextNode, beforeChild: GjsElement): void {
    ensureNotText(newChild);

    if (!GjsElementManager.isGjsElementOfKind(newChild, StackScreenElement)) {
      throw new Error("Stack can only have StackItem's as it's children.");
    }

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
    this.children.removeChild(child as StackScreenElement);
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
