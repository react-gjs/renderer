import { DataType } from "dilswer";
import Gtk from "gi://Gtk";
import { EventPhase } from "../../../reconciler/event-phase";
import type { GjsContext } from "../../../reconciler/gjs-renderer";
import type { HostContext } from "../../../reconciler/host-context";
import { BaseElement, type GjsElement } from "../../gjs-element";
import { GjsElementManager } from "../../gjs-element-manager";
import { ElementLifecycleController } from "../../utils/element-extenders/element-lifecycle-controller";
import type { SyntheticEvent } from "../../utils/element-extenders/event-handlers";
import { EventHandlers } from "../../utils/element-extenders/event-handlers";
import type { DiffedProps } from "../../utils/element-extenders/map-properties";
import { PropertyMapper } from "../../utils/element-extenders/map-properties";
import type { PointerData } from "../../utils/gdk-events/pointer-event";
import { parseCrossingEvent } from "../../utils/gdk-events/pointer-event";
import type { AccelProps } from "../../utils/property-maps-factories/create-accel-prop-mapper";
import { createAccelPropMapper } from "../../utils/property-maps-factories/create-accel-prop-mapper";
import type { ChildPropertiesProps } from "../../utils/property-maps-factories/create-child-props-mapper";
import { createChildPropsMapper } from "../../utils/property-maps-factories/create-child-props-mapper";
import type { ExpandProps } from "../../utils/property-maps-factories/create-expand-prop-mapper";
import { createExpandPropMapper } from "../../utils/property-maps-factories/create-expand-prop-mapper";
import type { MarginProps } from "../../utils/property-maps-factories/create-margin-prop-mapper";
import { createMarginPropMapper } from "../../utils/property-maps-factories/create-margin-prop-mapper";
import type { SizeRequestProps } from "../../utils/property-maps-factories/create-size-request-prop-mapper";
import { createSizeRequestPropMapper } from "../../utils/property-maps-factories/create-size-request-prop-mapper";
import type { StyleProps } from "../../utils/property-maps-factories/create-style-prop-mapper";
import { createStylePropMapper } from "../../utils/property-maps-factories/create-style-prop-mapper";
import type { TooltipProps } from "../../utils/property-maps-factories/create-tooltip-prop-mapper";
import { createTooltipPropMapper } from "../../utils/property-maps-factories/create-tooltip-prop-mapper";
import type { TextNode } from "../text-node";
import { MenuBarItemElement } from "./menu-bar-item";
import { MenuEntryElement } from "./menu-entry";

type MenuRadioButtonPropsMixin = ChildPropertiesProps &
  SizeRequestProps &
  MarginProps &
  ExpandProps &
  StyleProps &
  TooltipProps &
  AccelProps;

export type MenuRadioButtonEvent<P extends Record<string, any> = {}> =
  SyntheticEvent<P, MenuRadioButtonElement>;

export interface MenuRadioButtonProps
  extends MenuRadioButtonPropsMixin {
  /** Main text of the menu entry, displayed on the left side. */
  label?: string;
  radioGroup: string;
  isDefault?: boolean;
  inconsistent?: boolean;
  onClick?: (event: MenuRadioButtonEvent) => void;
  onToggle?: (
    event: MenuRadioButtonEvent<{ value: boolean }>,
  ) => void;
  onMouseEnter?: (event: MenuRadioButtonEvent<PointerData>) => void;
  onMouseLeave?: (event: MenuRadioButtonEvent<PointerData>) => void;
}

export class MenuRadioButtonElement
  extends BaseElement
  implements GjsElement<"MENU_RADIO_BUTTON", Gtk.RadioMenuItem>
{
  static getContext(
    currentContext: HostContext<GjsContext>,
  ): HostContext<GjsContext> {
    return currentContext;
  }

  readonly kind = "MENU_RADIO_BUTTON";
  protected widget = new Gtk.RadioMenuItem();

  protected parent: MenuBarItemElement | MenuEntryElement | null =
    null;
  protected rootBarItem: MenuBarItemElement | null = null;

  readonly lifecycle = new ElementLifecycleController();
  protected handlers = new EventHandlers<
    Gtk.MenuItem,
    MenuRadioButtonProps
  >(this);

  protected propsMapper = new PropertyMapper<MenuRadioButtonProps>(
    this.lifecycle,
  );

  protected isInitialized = false;
  protected unappliedProps = new Map<string, any>();

  constructor(props: DiffedProps) {
    super();
    this.updateProps(props);

    this.lifecycle.emitLifecycleEventAfterCreate();
  }

  setRootBarItem(barItem: MenuBarItemElement) {
    if (barItem === this.rootBarItem) {
      return;
    }

    const prevWidget = this.widget;

    this.rootBarItem = barItem;

    const radioGroup = this.rootBarItem.getRadioGroup(
      this.unappliedProps.get("radioGroup"),
    );

    const widget = Gtk.RadioMenuItem.new_from_widget(radioGroup);
    this.widget = widget;

    this.isInitialized = true;

    this.propsMapper = new PropertyMapper<MenuRadioButtonProps>(
      this.lifecycle,
      createSizeRequestPropMapper(widget),
      createMarginPropMapper(widget),
      createExpandPropMapper(widget),
      createStylePropMapper(widget),
      createTooltipPropMapper(widget),
      createAccelPropMapper(widget, "activate"),
      createChildPropsMapper(
        () => this.widget,
        () => this.parent,
      ),
      (props) =>
        props
          .label(DataType.String, (v = "") => {
            widget.label = v;
          })
          .inconsistent(DataType.Boolean, (v = false) => {
            widget.inconsistent = v;
          }),
    );

    this.handlers = new EventHandlers<
      Gtk.RadioMenuItem,
      MenuRadioButtonProps
    >(this);

    this.handlers.bind("clicked", "onClick");
    this.handlers.bind("toggled", "onToggle", () => {
      return {
        value: widget.active,
      };
    });
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

    this.lifecycle.emitLifecycleEventUpdate([
      ...this.unappliedProps.entries(),
    ]);
    this.unappliedProps.clear();

    const groupHasActiveEntry = radioGroup
      .get_group()
      .some((i) => i.active);
    if (
      !groupHasActiveEntry &&
      this.propsMapper.currentProps.isDefault
    ) {
      widget.set_active(true);
    }

    this.parent?.reattachRadioButton(this);
    prevWidget.destroy();
  }

  updateProps(props: DiffedProps): void {
    if (this.isInitialized) {
      this.lifecycle.emitLifecycleEventUpdate(props);
    } else {
      for (const prop of props) {
        this.unappliedProps.set(prop[0], prop[1]);
      }
    }
  }

  // #region This widget direct mutations

  appendChild(child: GjsElement | TextNode): void {
    throw new Error("MenuRadioButton cannot have children.");
  }

  insertBefore(
    newChild: GjsElement | TextNode,
    beforeChild: GjsElement,
  ): void {
    throw new Error("MenuRadioButton cannot have children.");
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
      GjsElementManager.isGjsElementOfKind(parent, [
        MenuBarItemElement,
        MenuEntryElement,
      ])
    ) {
      this.parent = parent;
    } else {
      throw new Error(
        "MenuRadioButton can only be a child of a MenuBarItem or MenuEntry.",
      );
    }

    return true;
  }

  notifyMounted(): void {
    this.lifecycle.emitMountedEvent();
  }

  notifyChildWillUnmount(child: GjsElement): void {}

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
