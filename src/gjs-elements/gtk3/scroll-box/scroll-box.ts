import { DataType } from "dilswer";
import Gtk from "gi://Gtk";
import type { PositionType } from "../../../g-enums";
import { CornerType, PolicyType, ShadowType } from "../../../g-enums";
import { EventPhase } from "../../../reconciler/event-phase";
import type { GjsContext } from "../../../reconciler/gjs-renderer";
import type { HostContext } from "../../../reconciler/host-context";
import type { GjsElement } from "../../gjs-element";
import { diffProps } from "../../utils/diff-props";
import { ChildOrderController } from "../../utils/element-extenders/child-order-controller";
import { ElementLifecycleController } from "../../utils/element-extenders/element-lifecycle-controller";
import type { SyntheticEvent } from "../../utils/element-extenders/event-handlers";
import {
  EventHandlers,
  EventNoop,
} from "../../utils/element-extenders/event-handlers";
import type { DiffedProps } from "../../utils/element-extenders/map-properties";
import { PropertyMapper } from "../../utils/element-extenders/map-properties";
import { ensureNotText } from "../../utils/ensure-not-string";
import { microtask } from "../../utils/micortask";
import type { AlignmentProps } from "../../utils/property-maps-factories/create-alignment-prop-mapper";
import { createAlignmentPropMapper } from "../../utils/property-maps-factories/create-alignment-prop-mapper";
import type { ExpandProps } from "../../utils/property-maps-factories/create-expand-prop-mapper";
import { createExpandPropMapper } from "../../utils/property-maps-factories/create-expand-prop-mapper";
import type { MarginProps } from "../../utils/property-maps-factories/create-margin-prop-mapper";
import { createMarginPropMapper } from "../../utils/property-maps-factories/create-margin-prop-mapper";
import type { SizeRequestProps } from "../../utils/property-maps-factories/create-size-request-prop-mapper";
import { createSizeRequestPropMapper } from "../../utils/property-maps-factories/create-size-request-prop-mapper";
import type { StyleProps } from "../../utils/property-maps-factories/create-style-prop-mapper";
import { createStylePropMapper } from "../../utils/property-maps-factories/create-style-prop-mapper";
import type { TextNode } from "../markup/text-node";

type ScrollBoxPropsMixin = SizeRequestProps &
  AlignmentProps &
  MarginProps &
  ExpandProps &
  StyleProps;

type DefaultEventData = {
  currentContentHeight: number;
  currentContentWidth: number;
  currentVPosition: number;
  currentHPosition: number;
};

export type ScrollBoxEvent<P extends Record<string, any> = {}> = SyntheticEvent<
  P & DefaultEventData,
  ScrollBoxElement
>;

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
  onEdgeReached?: (event: ScrollBoxEvent<{ position: PositionType }>) => void;
  onScroll?: (event: ScrollBoxEvent) => void;
  onContentSizeChange?: (event: ScrollBoxEvent) => void;
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
  private vAdjustment = this.widget.get_vadjustment();
  private hAdjustment = this.widget.get_hadjustment();

  private parent: GjsElement | null = null;

  readonly lifecycle = new ElementLifecycleController();
  private children = new ChildOrderController(this.lifecycle, this.widget);
  private handlers = new EventHandlers<Gtk.ScrolledWindow, ScrollBoxProps>(
    this
  );
  private vAdjustmentHandlers = new EventHandlers<
    Gtk.Adjustment,
    ScrollBoxProps
  >({
    widget: this.widget.get_vadjustment(),
    lifecycle: this.lifecycle,
  });
  private hAdjustmentHandlers = new EventHandlers<
    Gtk.Adjustment,
    ScrollBoxProps
  >({
    widget: this.widget.get_vadjustment(),
    lifecycle: this.lifecycle,
  });

  private readonly propsMapper = new PropertyMapper<ScrollBoxProps>(
    this.lifecycle,
    createSizeRequestPropMapper(this.widget),
    createAlignmentPropMapper(this.widget),
    createMarginPropMapper(this.widget),
    createExpandPropMapper(this.widget),
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

    this.handlers.bind(
      "scroll-event",
      "onScroll",
      () => this.getDefaultEventData(),
      EventPhase.Action
    );

    let lastVUpper = -1;
    this.vAdjustmentHandlers.bind("changed", "onContentSizeChange", () => {
      const upper = this.widget.vadjustment.get_upper();
      if (lastVUpper !== upper) {
        lastVUpper = upper;
        return this.getDefaultEventData();
      }
      throw new EventNoop();
    });

    let lastHUpper = -1;
    this.hAdjustmentHandlers.bind("changed", "onContentSizeChange", () => {
      const upper = this.widget.hadjustment.get_upper();
      if (lastHUpper !== upper) {
        lastHUpper = upper;
        return this.getDefaultEventData();
      }
      throw new EventNoop();
    });

    this.updateProps(props);
    this.lifecycle.emitLifecycleEventAfterCreate();
  }

  private getDefaultEventData(): DefaultEventData {
    const vAdjustment = this.widget.vadjustment;
    const hAdjustment = this.widget.hadjustment;
    return {
      currentContentHeight: vAdjustment.get_upper(),
      currentContentWidth: hAdjustment.get_upper(),
      currentHPosition: hAdjustment.get_value(),
      currentVPosition: vAdjustment.get_value(),
    };
  }

  scrollTo(
    position: number,
    from: "top" | "bottom" | "left" | "right" = "top"
  ) {
    // changing the value of the adjustment will trigger a "changed" event
    // immediately after, so to avoid unexpected side-effects taking
    // place on every "scrollTo" call, we use a microtask to delay the
    // change of the adjustment value
    switch (from) {
      case "top": {
        microtask(() => {
          this.vAdjustment.set_value(position);
        });
        break;
      }
      case "bottom": {
        const currentUpper = this.vAdjustment.get_upper();
        microtask(() => {
          this.vAdjustment.set_value(currentUpper - position);
        });
        break;
      }
      case "left": {
        microtask(() => {
          this.hAdjustment.set_value(position);
        });
        break;
      }
      case "right": {
        const currentUpper = this.hAdjustment.get_upper();
        microtask(() => {
          this.hAdjustment.set_value(currentUpper - position);
        });
        break;
      }
    }
  }

  scrollToEnd(orientation: "vertically" | "horizontally" = "vertically") {
    // changing the value of the adjustment will trigger a "changed" event
    // immediately after, so to avoid unexpected side-effects taking
    // place on every "scrollTo" call, we use a microtask to delay the
    // change of the adjustment value
    switch (orientation) {
      case "vertically": {
        const currentUpper = this.vAdjustment.get_upper();
        microtask(() => {
          this.vAdjustment.set_value(currentUpper);
        });
        break;
      }
      case "horizontally": {
        const currentUpper = this.hAdjustment.get_upper();
        microtask(() => {
          this.hAdjustment.set_value(currentUpper);
        });
        break;
      }
    }
  }

  currentPosition(from: "top" | "bottom" | "left" | "right" = "top") {
    switch (from) {
      case "top":
        return this.vAdjustment.get_value();
      case "bottom":
        return this.vAdjustment.get_upper() - this.vAdjustment.get_value();
      case "left":
        return this.hAdjustment.get_value();
      case "right":
        return this.hAdjustment.get_upper() - this.hAdjustment.get_value();
    }
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

    const shouldAppend = child.notifyWillAppendTo(this);
    this.children.addChild(child, !shouldAppend);
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

  notifyWillAppendTo(parent: GjsElement): boolean {
    this.parent = parent;
    return true;
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
