import { DataType } from "dilswer";
import Gio from "gi://Gio";
import Gtk from "gi://Gtk";
import { EventPhase } from "../../../../reconciler/event-phase";
import type { GjsContext } from "../../../../reconciler/gjs-renderer";
import type { HostContext } from "../../../../reconciler/host-context";
import { BaseElement, type GjsElement } from "../../../gjs-element";
import { GjsElementManager } from "../../../gjs-element-manager";
import { ElementLifecycleController } from "../../../utils/element-extenders/element-lifecycle-controller";
import type { SyntheticEvent } from "../../../utils/element-extenders/event-handlers";
import { EventHandlers } from "../../../utils/element-extenders/event-handlers";
import type { DiffedProps } from "../../../utils/element-extenders/map-properties";
import { PropertyMapper } from "../../../utils/element-extenders/map-properties";
import type { PointerData } from "../../../utils/gdk-events/pointer-event";
import { parseCrossingEvent } from "../../../utils/gdk-events/pointer-event";
import type { AccelProps } from "../../../utils/property-maps-factories/create-accel-prop-mapper";
import { createAccelPropMapper } from "../../../utils/property-maps-factories/create-accel-prop-mapper";
import type { ChildPropertiesProps } from "../../../utils/property-maps-factories/create-child-props-mapper";
import { createChildPropsMapper } from "../../../utils/property-maps-factories/create-child-props-mapper";
import type { MarginProps } from "../../../utils/property-maps-factories/create-margin-prop-mapper";
import { createMarginPropMapper } from "../../../utils/property-maps-factories/create-margin-prop-mapper";
import type { SizeRequestProps } from "../../../utils/property-maps-factories/create-size-request-prop-mapper";
import { createSizeRequestPropMapper } from "../../../utils/property-maps-factories/create-size-request-prop-mapper";
import type { StyleProps } from "../../../utils/property-maps-factories/create-style-prop-mapper";
import { createStylePropMapper } from "../../../utils/property-maps-factories/create-style-prop-mapper";
import type { TooltipProps } from "../../../utils/property-maps-factories/create-tooltip-prop-mapper";
import { createTooltipPropMapper } from "../../../utils/property-maps-factories/create-tooltip-prop-mapper";
import type { TextNode } from "../../text-node";
import type { PopoverMenuElement } from "../popover-menu";
import { PopoverMenuContentElement } from "../popover-menu-content";
import { popoverMenuModelButton } from "../utils/popover-menu-model-button";
import { PopoverMenuEntryElement } from "./popover-menu-entry";

type PopoverMenuCheckButtonPropsMixin =
  & ChildPropertiesProps
  & SizeRequestProps
  & MarginProps
  & StyleProps
  & TooltipProps
  & AccelProps;

export type PopoverMenuCheckButtonEvent<
  P extends Record<string, any> = {},
> = SyntheticEvent<P, PopoverMenuCheckButtonElement>;

export interface PopoverMenuCheckButtonProps extends PopoverMenuCheckButtonPropsMixin {
  label?: string;
  icon?: Rg.IconName;
  centered?: boolean;
  inverted?: boolean;
  active?: boolean;
  onChange?: (
    e: PopoverMenuCheckButtonEvent<{ isActive: boolean }>,
  ) => void;
  onPressed?: (event: PopoverMenuCheckButtonEvent) => void;
  onReleased?: (event: PopoverMenuCheckButtonEvent) => void;
  onMouseEnter?: (
    event: PopoverMenuCheckButtonEvent<PointerData>,
  ) => void;
  onMouseLeave?: (
    event: PopoverMenuCheckButtonEvent<PointerData>,
  ) => void;
}

export class PopoverMenuCheckButtonElement extends BaseElement
  implements GjsElement<"POPOVER_MENU_CHECK_BUTTON", Gtk.ModelButton>
{
  static getContext(
    currentContext: HostContext<GjsContext>,
  ): HostContext<GjsContext> {
    return currentContext;
  }

  readonly kind = "POPOVER_MENU_CHECK_BUTTON";
  protected widget = popoverMenuModelButton();

  protected parent:
    | PopoverMenuEntryElement
    | PopoverMenuContentElement
    | null = null;

  readonly lifecycle = new ElementLifecycleController();
  protected readonly handlers = new EventHandlers<
    Gtk.ModelButton,
    PopoverMenuCheckButtonProps
  >(this);
  protected readonly propsMapper = new PropertyMapper<PopoverMenuCheckButtonProps>(
    this.lifecycle,
    createSizeRequestPropMapper(this.widget),
    createMarginPropMapper(this.widget),
    createStylePropMapper(this.widget),
    createTooltipPropMapper(this.widget),
    createAccelPropMapper(this.widget),
    createChildPropsMapper(
      () => this.widget,
      () => this.parent,
    ),
    (props) =>
      props
        .label(DataType.String, (v = "") => {
          this.widget.text = v;
        })
        .icon(DataType.String, (v = "") => {
          this.widget.icon = Gio.Icon.new_for_string(v)!;
        })
        .centered(DataType.Boolean, (v = false) => {
          this.widget.centered = v;
        })
        .inverted(DataType.Boolean, (v = false) => {
          this.widget.inverted = v;
        })
        .active(DataType.Boolean, (v = false) => {
          this.widget.active = v;
        }),
  );

  constructor(props: DiffedProps) {
    super();
    this.widget.role = Gtk.ButtonRole.CHECK;

    this.handlers.bindInternal("clicked", (e) => {
      if (this.getProperty("active") == null) {
        this.widget.active = !this.widget.active;
      }
    });

    this.handlers.bind("pressed", "onPressed");
    this.handlers.bind("released", "onReleased");
    this.handlers.bind("clicked", "onChange", () => ({
      isActive: !this.widget.active,
    }));
    this.handlers.bind(
      "enter-notify-event",
      "onMouseEnter",
      parseCrossingEvent,
      EventPhase.Action,
    );
    this.handlers.bind(
      "leave-notify-event",
      "onMouseLeave",
      parseCrossingEvent,
      EventPhase.Action,
    );

    this.updateProps(props);

    this.lifecycle.emitLifecycleEventAfterCreate();
  }

  setParentMenu(name: string) {}

  setRootMenu(root: PopoverMenuElement) {}

  updateProps(props: DiffedProps): void {
    this.lifecycle.emitLifecycleEventUpdate(props);
  }

  // #region This widget direct mutations

  appendChild(child: TextNode | GjsElement): void {
    throw new Error("PopoverMenuCheckButton cannot have children.");
  }

  insertBefore(
    child: TextNode | GjsElement,
    beforeChild: GjsElement,
  ): void {
    throw new Error("PopoverMenuCheckButton cannot have children.");
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
    if (
      !GjsElementManager.isGjsElementOfKind(parent, [
        PopoverMenuEntryElement,
        PopoverMenuContentElement,
      ])
    ) {
      throw new Error(
        "PopoverMenuCheckButton can only be appended to a Popover or another PopoverMenuEntry.",
      );
    }
    this.parent = parent;
    return true;
  }

  notifyMounted(): void {
    this.lifecycle.emitMountedEvent();
  }

  notifyChildWillUnmount(child: GjsElement) {}

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
