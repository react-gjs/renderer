import { DataType } from "dilswer";
import Gtk from "gi://Gtk";
import { MenuCheckButtonType } from "../../../enums/custom";
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
import type { PointerData } from "../../utils/gdk-events/pointer-event";
import { parseCrossingEvent } from "../../utils/gdk-events/pointer-event";
import type { AccelProps } from "../../utils/property-maps-factories/create-accel-prop-mapper";
import { createAccelPropMapper } from "../../utils/property-maps-factories/create-accel-prop-mapper";
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

type MenuCheckButtonPropsMixin = SizeRequestProps &
  MarginProps &
  ExpandProps &
  StyleProps &
  TooltipProps &
  AccelProps;

export type MenuCheckButtonEvent<P extends Record<string, any> = {}> =
  SyntheticEvent<P, MenuCheckButtonElement>;

export interface MenuCheckButtonProps extends MenuCheckButtonPropsMixin {
  /** Main text of the menu entry, displayed on the left side. */
  label?: string;
  value?: boolean;
  type?: MenuCheckButtonType;
  inconsistent?: boolean;
  onToggle?: (event: MenuCheckButtonEvent<{ value: boolean }>) => void;
  onMouseEnter?: (event: MenuCheckButtonEvent<PointerData>) => void;
  onMouseLeave?: (event: MenuCheckButtonEvent<PointerData>) => void;
}

export class MenuCheckButtonElement
  implements GjsElement<"MENU_CHECK_BUTTON", Gtk.CheckMenuItem>
{
  static getContext(
    currentContext: HostContext<GjsContext>
  ): HostContext<GjsContext> {
    return currentContext;
  }

  readonly kind = "MENU_CHECK_BUTTON";
  private widget = new Gtk.CheckMenuItem();

  private parent: MenuBarItemElement | MenuEntryElement | null = null;

  readonly lifecycle = new ElementLifecycleController();
  private readonly handlers = new EventHandlers<
    Gtk.MenuItem,
    MenuCheckButtonProps
  >(this);

  private readonly propsMapper = new PropertyMapper<MenuCheckButtonProps>(
    this.lifecycle,
    createSizeRequestPropMapper(this.widget),
    createMarginPropMapper(this.widget),
    createExpandPropMapper(this.widget),
    createStylePropMapper(this.widget),
    createTooltipPropMapper(this.widget),
    createAccelPropMapper(this.widget, "activate"),
    (props) =>
      props
        .label(DataType.String, (v = "") => {
          this.widget.label = v;
        })
        .value(DataType.Boolean, (v = false) => {
          this.widget.active = v;
        })
        .type(
          DataType.Enum(MenuCheckButtonType),
          (v = MenuCheckButtonType.CHECK) => {
            this.widget.draw_as_radio = v === MenuCheckButtonType.RADIO;
          }
        )
        .inconsistent(DataType.Boolean, (v = false) => {
          this.widget.inconsistent = v;
        })
  );

  constructor(props: DiffedProps) {
    this.handlers.bind("activate", "onToggle", () => {
      return {
        value: this.widget.active,
      };
    });
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

  setRootBarItem(barItem: MenuBarItemElement) {}

  updateProps(props: DiffedProps): void {
    this.lifecycle.emitLifecycleEventUpdate(props);
  }

  // #region This widget direct mutations

  appendChild(child: GjsElement | TextNode): void {
    throw new Error("MenuCheckButton cannot have children.");
  }

  insertBefore(newChild: GjsElement | TextNode, beforeChild: GjsElement): void {
    throw new Error("MenuCheckButton cannot have children.");
  }

  remove(parent: GjsElement): void {
    parent.notifyWillUnmount(this);

    this.lifecycle.emitLifecycleEventBeforeDestroy();

    this.widget.destroy();
  }

  render() {
    this.widget.show_all();
  }

  // #endregion

  // #region Element internal signals

  notifyWillAppendTo(parent: GjsElement): boolean {
    if (
      !GjsElementManager.isGjsElementOfKind(parent, [
        MenuBarItemElement,
        MenuEntryElement,
      ])
    ) {
      throw new Error(
        "MenuBarItem can only be a child of a MenuBar or MenuEntry."
      );
    }

    this.parent = parent;
    return true;
  }

  notifyWillUnmount(child: GjsElement): void {}

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

  addEventListener(
    signal: string,
    callback: Rg.GjsElementEvenTListenerCallback
  ): void {
    return this.handlers.addListener(signal, callback);
  }

  removeEventListener(
    signal: string,
    callback: Rg.GjsElementEvenTListenerCallback
  ): void {
    return this.handlers.removeListener(signal, callback);
  }

  setProperty(key: string, value: any) {
    this.lifecycle.emitLifecycleEventUpdate([[key, value]]);
  }

  getProperty(key: string) {
    return this.propsMapper.get(key);
  }

  diffProps(
    oldProps: Record<string, any>,
    newProps: Record<string, any>
  ): DiffedProps {
    return diffProps(oldProps, newProps, true);
  }

  // #endregion
}
