import { DataType } from "dilswer";
import Gtk from "gi://Gtk";
import type { StackTransitionType } from "../../../enums/gtk3-index";
import type { GjsContext } from "../../../reconciler/gjs-renderer";
import type { HostContext } from "../../../reconciler/host-context";
import { BaseElement, type GjsElement } from "../../gjs-element";
import { GjsElementManager } from "../../gjs-element-manager";
import { ChildOrderController } from "../../utils/element-extenders/child-order-controller";
import { ElementLifecycleController } from "../../utils/element-extenders/element-lifecycle-controller";
import { EventHandlers } from "../../utils/element-extenders/event-handlers";
import type { DiffedProps } from "../../utils/element-extenders/map-properties";
import { PropertyMapper } from "../../utils/element-extenders/map-properties";
import { ensureNotText } from "../../utils/ensure-not-string";
import { mountAction } from "../../utils/mount-action";
import type { AlignmentProps } from "../../utils/property-maps-factories/create-alignment-prop-mapper";
import { createAlignmentPropMapper } from "../../utils/property-maps-factories/create-alignment-prop-mapper";
import type { ChildPropertiesProps } from "../../utils/property-maps-factories/create-child-props-mapper";
import { createChildPropsMapper } from "../../utils/property-maps-factories/create-child-props-mapper";
import type { ExpandProps } from "../../utils/property-maps-factories/create-expand-prop-mapper";
import { createExpandPropMapper } from "../../utils/property-maps-factories/create-expand-prop-mapper";
import type { MarginProps } from "../../utils/property-maps-factories/create-margin-prop-mapper";
import { createMarginPropMapper } from "../../utils/property-maps-factories/create-margin-prop-mapper";
import type { SizeRequestProps } from "../../utils/property-maps-factories/create-size-request-prop-mapper";
import { createSizeRequestPropMapper } from "../../utils/property-maps-factories/create-size-request-prop-mapper";
import type { TextNode } from "../text-node";
import { StackScreenElement } from "./stack-screen";

type StackPropsMixin = ChildPropertiesProps &
  SizeRequestProps &
  AlignmentProps &
  MarginProps &
  ExpandProps;

export interface StackProps extends StackPropsMixin {
  transitionDuration?: number;
  transitionType?: StackTransitionType;
  interpolateSize?: boolean;
  sameSize?: boolean;
  children?: React.ReactElement | React.ReactElement[];
}

export class StackElement
  extends BaseElement
  implements GjsElement<"STACK", Gtk.Stack>
{
  static getContext(
    currentContext: HostContext<GjsContext>,
  ): HostContext<GjsContext> {
    return currentContext;
  }

  readonly kind = "STACK";
  protected widget: Gtk.Stack;

  protected parent: GjsElement | null = null;

  readonly lifecycle = new ElementLifecycleController();
  protected readonly handlers = new EventHandlers<
    Gtk.Stack,
    StackProps
  >(this);
  // eslint-disable-next-line max-len
  protected declare readonly children: ChildOrderController<StackScreenElement>;
  protected readonly propsMapper = new PropertyMapper<StackProps>(
    this.lifecycle,
  );

  constructor(props: DiffedProps) {
    super();
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
      },
    );

    this.propsMapper.addCases(
      createSizeRequestPropMapper(this.widget),
      createAlignmentPropMapper(this.widget),
      createMarginPropMapper(this.widget),
      createExpandPropMapper(this.widget),
      createChildPropsMapper(
        () => this.widget,
        () => this.parent,
      ),
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
            DataType.Enum(Gtk.StackTransitionType),
            (v = Gtk.StackTransitionType.CROSSFADE) => {
              this.widget.set_transition_type(v);
            },
          ),
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

    if (
      !GjsElementManager.isGjsElementOfKind(child, StackScreenElement)
    ) {
      throw new Error(
        "Stack can only have StackItem's as it's children.",
      );
    }

    mountAction(
      this,
      child,
      (shouldOmitMount) => {
        this.children.addChild(child, shouldOmitMount);
      },
      () => {
        this.widget.show_all();
      },
    );
  }

  insertBefore(
    child: GjsElement | TextNode,
    beforeChild: GjsElement,
  ): void {
    ensureNotText(child);

    if (
      !GjsElementManager.isGjsElementOfKind(child, StackScreenElement)
    ) {
      throw new Error(
        "Stack can only have StackItem's as it's children.",
      );
    }

    mountAction(
      this,
      child,
      (shouldOmitMount) => {
        this.children.insertBefore(
          child,
          beforeChild,
          shouldOmitMount,
        );
      },
      () => {
        this.widget.show_all();
      },
    );
  }

  remove(parent: GjsElement): void {
    parent.notifyChildWillUnmount(this);

    this.lifecycle.emitLifecycleEventBeforeDestroy();

    this.widget.destroy();
  }

  render() {
    this.widget.show_all();
  }

  // #endregion

  // #region Element internal signals

  notifyWillMountTo(parent: GjsElement): boolean {
    this.parent = parent;
    return true;
  }

  notifyMounted(): void {
    this.lifecycle.emitMountedEvent();
  }

  notifyChildWillUnmount(child: GjsElement): void {
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

  getWidget() {
    return this.widget;
  }

  getParentElement() {
    return this.parent;
  }

  // #endregion
}
