import { DataType } from "dilswer";
import Gtk from "gi://Gtk";
import type { PositionType } from "../../g-enums";
import { CornerType, PolicyType, ShadowType } from "../../g-enums";
import { diffProps } from "../../reconciler/diff-props";
import type { GjsElement } from "../gjs-element";
import { ensureNotString } from "../utils/ensure-not-string";
import type { SyntheticEvent } from "../utils/event-handlers";
import { EventHandlers } from "../utils/event-handlers";
import type { DiffedProps } from "../utils/map-properties";
import { createPropMap } from "../utils/map-properties";
import type { AlignmentProps } from "../utils/property-maps-factories/create-alignment-prop-mapper";
import { createAlignmentPropMapper } from "../utils/property-maps-factories/create-alignment-prop-mapper";
import type { MarginProps } from "../utils/property-maps-factories/create-margin-prop-mapper";
import { createMarginPropMapper } from "../utils/property-maps-factories/create-margin-prop-mapper";
import { ChildOrderController } from "../utils/widget-operations/child-order-controller";

type ScrollBoxPropsMixin = AlignmentProps & MarginProps;

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
  children: React.ReactElement;
  onEdgeReached?: (event: SyntheticEvent<{ position: PositionType }>) => void;
}

export class ScrollBoxElement
  implements GjsElement<"SCROLL_BOX", Gtk.ScrolledWindow>
{
  readonly kind = "SCROLL_BOX";

  private parent: GjsElement | null = null;
  widget = new Gtk.ScrolledWindow();
  private children = new ChildOrderController(Gtk.ScrolledWindow, this.widget);

  private handlers = new EventHandlers<Gtk.ScrolledWindow, ScrollBoxProps>(
    this.widget
  );

  private readonly propsMapper = createPropMap<ScrollBoxProps>(
    createAlignmentPropMapper(this.widget),
    createMarginPropMapper(this.widget),
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

  constructor(props: any) {
    this.handlers.bind("edge-reached", "onEdgeReached", (e: PositionType) => {
      return { position: e };
    });

    this.updateProps(props);
  }

  notifyWillAppendTo(parent: GjsElement): void {
    this.parent = parent;
  }

  appendChild(child: GjsElement | string): void {
    ensureNotString(child);

    if (this.children.count() > 0) {
      throw new Error("ScrollBox can only have one child.");
    }

    child.notifyWillAppendTo(this);
    this.children.addChild(child);
    this.widget.show_all();
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

  updateProps(props: DiffedProps): void {
    this.propsMapper.update(props);
    this.handlers.update(props);
  }

  render() {
    this.parent?.widget.show_all();
  }

  insertBefore(newChild: GjsElement | string, beforeChild: GjsElement): void {
    ensureNotString(newChild);

    if (this.children.count() > 0) {
      throw new Error("ScrollBox can only have one child.");
    }

    newChild.notifyWillAppendTo(this);
    this.children.insertBefore(newChild, beforeChild);
    this.widget.show_all();
  }

  diffProps(
    oldProps: Record<string, any>,
    newProps: Record<string, any>
  ): DiffedProps {
    return diffProps(oldProps, newProps, true);
  }
}
