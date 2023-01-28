import { DataType } from "dilswer";
import Gtk from "gi://Gtk";
import { EventPhase } from "../../../reconciler/event-phase";
import type { GjsContext } from "../../../reconciler/gjs-renderer";
import type { HostContext } from "../../../reconciler/host-context";
import type { GjsElement } from "../../gjs-element";
import { GjsElementManager } from "../../gjs-element-manager";
import { diffProps } from "../../utils/diff-props";
import { ElementLifecycleController } from "../../utils/element-extenders/element-lifecycle-controller";
import type { SyntheticEvent } from "../../utils/element-extenders/event-handlers";
import { EventHandlers } from "../../utils/element-extenders/event-handlers";
import type { DiffedProps } from "../../utils/element-extenders/map-properties";
import { PropertyMapper } from "../../utils/element-extenders/map-properties";
import { TextChildController } from "../../utils/element-extenders/text-child-controller";
import { parseCrossingEvent } from "../../utils/gdk-events/pointer-event";
import type { IconName } from "../../utils/icons/icon-types";
import type { AlignmentProps } from "../../utils/property-maps-factories/create-alignment-prop-mapper";
import { createAlignmentPropMapper } from "../../utils/property-maps-factories/create-alignment-prop-mapper";
import type { ExpandProps } from "../../utils/property-maps-factories/create-expand-prop-mapper";
import { createExpandPropMapper } from "../../utils/property-maps-factories/create-expand-prop-mapper";
import type { MarginProps } from "../../utils/property-maps-factories/create-margin-prop-mapper";
import { createMarginPropMapper } from "../../utils/property-maps-factories/create-margin-prop-mapper";
import type { StyleProps } from "../../utils/property-maps-factories/create-style-prop-mapper";
import { createStylePropMapper } from "../../utils/property-maps-factories/create-style-prop-mapper";
import type { TextNode } from "../markup/text-node";
import { ToolbarElement } from "./toolbar";

type ToolbarButtonPropsMixin = AlignmentProps &
  MarginProps &
  ExpandProps &
  StyleProps;

export type ToolbarButtonEvent<P extends Record<string, any> = {}> =
  SyntheticEvent<P, ToolbarButtonElement>;

export interface ToolbarButtonProps extends ToolbarButtonPropsMixin {
  label?: string;
  icon?: IconName;
  useUnderline?: boolean;
  focusOnClick?: boolean;
  sameSize?: boolean;
  expand?: boolean;
  onClick?: (event: ToolbarButtonEvent) => void;
  onMouseEnter?: (event: ToolbarButtonEvent<PointerEvent>) => void;
  onMouseLeave?: (event: ToolbarButtonEvent<PointerEvent>) => void;
}

export class ToolbarButtonElement
  implements GjsElement<"TOOLBAR_BUTTON", Gtk.ToolButton>
{
  static getContext(
    currentContext: HostContext<GjsContext>
  ): HostContext<GjsContext> {
    return currentContext.set({
      isInTextContext: true,
    });
  }

  readonly kind = "TOOLBAR_BUTTON";
  widget = new Gtk.ToolButton();

  private parent: GjsElement | null = null;

  readonly lifecycle = new ElementLifecycleController();
  private readonly handlers = new EventHandlers<
    Gtk.ToolButton,
    ToolbarButtonProps
  >(this);
  private readonly propsMapper = new PropertyMapper<ToolbarButtonProps>(
    this.lifecycle,
    createAlignmentPropMapper(this.widget),
    createMarginPropMapper(this.widget),
    createExpandPropMapper(this.widget),
    createStylePropMapper(this.widget),
    (props) =>
      props
        .label(DataType.String, (v = "") => {
          this.widget.label = v;
        })
        .useUnderline(DataType.Boolean, (v = false) => {
          this.widget.use_underline = v;
        })
        .focusOnClick(DataType.Boolean, (v = true) => {
          this.widget.focus_on_click = v;
        })
        .icon(DataType.String, (v) => {
          if (v) {
            this.widget.icon_name = v;
          }
        })
        .sameSize(DataType.Boolean, (v = true) => {
          this.widget.set_homogeneous(v);
        })
        .expand(DataType.Boolean, (v = false) => {
          this.widget.set_expand(v);
        })
  );

  private readonly children = new TextChildController(
    this.lifecycle,
    (text) => {
      this.widget.label = text;
    }
  );

  constructor(props: DiffedProps) {
    this.handlers.bind("clicked", "onClick");
    this.handlers.bind(
      "enter-notify-event",
      "onMouseEnter",
      parseCrossingEvent,
      EventPhase.Action
    );
    this.handlers.bind(
      "leave-notify-event",
      "onMouseLeave",
      parseCrossingEvent,
      EventPhase.Action
    );

    this.updateProps(props);

    this.lifecycle.emitLifecycleEventAfterCreate();
  }

  updateProps(props: DiffedProps): void {
    this.lifecycle.emitLifecycleEventUpdate(props);
  }

  // #region This widget direct mutations

  appendChild(child: TextNode | GjsElement): void {
    if (child.kind === "TEXT_NODE") {
      child.notifyWillAppendTo(this);
      this.children.addChild(child);
      this.widget.show_all();
      return;
    }

    throw new Error("Button cannot have non-text children.");
  }

  insertBefore(
    child: TextNode | GjsElement,
    beforeChild: TextNode | GjsElement
  ): void {
    if (child.kind === "TEXT_NODE") {
      child.notifyWillAppendTo(this);
      this.children.insertBefore(child, beforeChild);
      this.widget.show_all();
      return;
    }

    throw new Error("Button cannot have non-text children.");
  }

  remove(parent: GjsElement): void {
    parent.notifyWillUnmount(this);

    this.lifecycle.emitLifecycleEventBeforeDestroy();

    this.widget.destroy();
  }

  render() {
    this.children.update();
    this.parent?.widget.show_all();
  }

  // #endregion

  // #region Element internal signals

  notifyWillAppendTo(parent: GjsElement): boolean {
    if (GjsElementManager.isGjsElementOfKind(parent, ToolbarElement)) {
      this.parent = parent;
    } else {
      throw new Error("ToolbarButton can only be a child of a toolbar.");
    }
    return true;
  }

  notifyWillUnmount(child: TextNode | GjsElement) {
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
