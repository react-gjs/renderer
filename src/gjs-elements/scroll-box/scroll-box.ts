import { DataType } from "dilswer";
import Gtk from "gi://Gtk";
import type { PositionType } from "../../g-enums";
import { CornerType, PolicyType, ShadowType } from "../../g-enums";
import { EventPhase } from "../../reconciler/event-phase";
import type { GjsContext } from "../../reconciler/gjs-renderer";
import type { HostContext } from "../../reconciler/host-context";
import type { GjsElement } from "../gjs-element";
import type { TextNode } from "../markup/text-node";
import { diffProps } from "../utils/diff-props";
import { ChildOrderController } from "../utils/element-extenders/child-order-controller";
import { ElementLifecycleController } from "../utils/element-extenders/element-lifecycle-controller";
import type { SyntheticEvent } from "../utils/element-extenders/event-handlers";
import { EventHandlers } from "../utils/element-extenders/event-handlers";
import type { DiffedProps } from "../utils/element-extenders/map-properties";
import { PropertyMapper } from "../utils/element-extenders/map-properties";
import { ensureNotText } from "../utils/ensure-not-string";
import type { AlignmentProps } from "../utils/property-maps-factories/create-alignment-prop-mapper";
import { createAlignmentPropMapper } from "../utils/property-maps-factories/create-alignment-prop-mapper";
import type { MarginProps } from "../utils/property-maps-factories/create-margin-prop-mapper";
import { createMarginPropMapper } from "../utils/property-maps-factories/create-margin-prop-mapper";
import type { StyleProps } from "../utils/property-maps-factories/create-style-prop-mapper";
import { createStylePropMapper } from "../utils/property-maps-factories/create-style-prop-mapper";

type ScrollBoxPropsMixin = AlignmentProps & MarginProps & StyleProps;

export interface ScrollBoxProps extends ScrollBoxPropsMixin {
  maxWidth?: number;
  maxHeight?: number;
  minWidth?: number;
  minHeight?: number;
  useChildHeight?: boolean;
  useChildWidth?: boolean;
  placement?: CornerType;
  horizontalScrollbar?: PolicyType;
  verticalScrollbar?: PolicyType;
  shadow?: ShadowType;
  overlayScrolling?: boolean;
  onEdgeReached?: (event: SyntheticEvent<{ position: PositionType }>) => void;
}

export class ScrollBoxElement
  implements GjsElement<"SCROLL_BOX", Gtk.ScrolledWindow>
{
  static getContext(
    currentContext: HostContext<GjsContext>
  ): HostContext<GjsContext> {
    return currentContext;
  }

  readonly kind = "SCROLL_BOX";
  widget = new Gtk.ScrolledWindow();

  private parent: GjsElement | null = null;

  private readonly lifecycle = new ElementLifecycleController();
  private children = new ChildOrderController(this.lifecycle, this.widget);
  private handlers = new EventHandlers<Gtk.ScrolledWindow, ScrollBoxProps>(
    this.lifecycle,
    this.widget
  );

  private readonly propsMapper = new PropertyMapper<ScrollBoxProps>(
    this.lifecycle,
    createAlignmentPropMapper(this.widget),
    createMarginPropMapper(this.widget),
    createStylePropMapper(this.widget),
    (props) =>
      props
        .horizontalScrollbar(
          DataType.Enum(PolicyType),
          (v = PolicyType.AUTOMATIC) => {
            this.widget.hscrollbar_policy = v;
          }
        )
        .verticalScrollbar(
          DataType.Enum(PolicyType),
          (v = PolicyType.AUTOMATIC) => {
            this.widget.vscrollbar_policy = v;
          }
        )
        .maxHeight(DataType.Number, (v = -1) => {
          this.widget.max_content_height = v;
        })
        .maxWidth(DataType.Number, (v = -1) => {
          this.widget.max_content_width = v;
        })
        .minHeight(DataType.Number, (v = -1) => {
          this.widget.min_content_height = v;
        })
        .minWidth(DataType.Number, (v = -1) => {
          this.widget.min_content_width = v;
        })
        .useChildHeight(DataType.Boolean, (v = false) => {
          this.widget.propagate_natural_height = v;
        })
        .useChildWidth(DataType.Boolean, (v = false) => {
          this.widget.propagate_natural_width = v;
        })
        .overlayScrolling(DataType.Boolean, (v = true) => {
          this.widget.overlay_scrolling = v;
        })
        .placement(DataType.Enum(CornerType), (v = CornerType.TOP_LEFT) => {
          this.widget.window_placement = v;
        })
        .shadow(DataType.Enum(ShadowType), (v = ShadowType.NONE) => {
          this.widget.shadow_type = v;
        })
  );

  constructor(props: DiffedProps) {
    this.handlers.bind(
      "edge-reached",
      "onEdgeReached",
      (e: PositionType) => {
        return { position: e };
      },
      EventPhase.Action
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

    if (this.children.count() > 0) {
      throw new Error("ScrollBox can only have one child.");
    }

    child.notifyWillAppendTo(this);
    this.children.addChild(child);
    this.widget.show_all();
  }

  insertBefore(newChild: GjsElement | TextNode, beforeChild: GjsElement): void {
    throw new Error("ScrollBox can only have one child.");
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
