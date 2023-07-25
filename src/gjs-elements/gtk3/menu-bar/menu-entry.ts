import { DataType } from "dilswer";
import Gtk from "gi://Gtk";
import { EventPhase } from "../../../reconciler/event-phase";
import type { GjsContext } from "../../../reconciler/gjs-renderer";
import type { HostContext } from "../../../reconciler/host-context";
import type { GjsElement } from "../../gjs-element";
import { GjsElementManager } from "../../gjs-element-manager";
import { diffProps } from "../../utils/diff-props";
import { ChildOrderController } from "../../utils/element-extenders/child-order-controller";
import { ElementLifecycleController } from "../../utils/element-extenders/element-lifecycle-controller";
import type { SyntheticEvent } from "../../utils/element-extenders/event-handlers";
import { EventHandlers } from "../../utils/element-extenders/event-handlers";
import type { DiffedProps } from "../../utils/element-extenders/map-properties";
import { PropertyMapper } from "../../utils/element-extenders/map-properties";
import { ensureNotText } from "../../utils/ensure-not-string";
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
import { MenuCheckButtonElement } from "./menu-check-button";
import { MenuRadioButtonElement } from "./menu-radio-button";

type MenuEntryPropsMixin = SizeRequestProps &
  MarginProps &
  ExpandProps &
  StyleProps &
  TooltipProps &
  AccelProps;

export type MenuEntryEvent<P extends Record<string, any> = {}> =
  SyntheticEvent<P, MenuEntryElement>;

export interface MenuEntryProps extends MenuEntryPropsMixin {
  /**
   * Main text of the menu entry, displayed on the left side.
   */
  label?: string;
  onActivate?: (event: MenuEntryEvent) => void;
  onMouseEnter?: (event: MenuEntryEvent<PointerData>) => void;
  onMouseLeave?: (event: MenuEntryEvent<PointerData>) => void;
}

export class MenuEntryElement
  implements GjsElement<"MENU_ENTRY", Gtk.MenuItem>
{
  static getContext(
    currentContext: HostContext<GjsContext>,
  ): HostContext<GjsContext> {
    return currentContext;
  }

  readonly kind = "MENU_ENTRY";
  private widget = new Gtk.MenuItem();

  submenu?: Gtk.Menu;
  labelContainer = new Gtk.Box();

  private parent: MenuBarItemElement | MenuEntryElement | null = null;
  private rootBarItem: MenuBarItemElement | null = null;

  readonly lifecycle = new ElementLifecycleController();
  private readonly handlers = new EventHandlers<
    Gtk.MenuItem,
    MenuEntryProps
  >(this);
  private readonly children = new ChildOrderController<
    MenuEntryElement | MenuCheckButtonElement | MenuRadioButtonElement
  >(
    this.lifecycle,
    this.widget,
    (child) => {
      if (!this.submenu) {
        this.submenu = new Gtk.Menu();
        this.widget.set_submenu(this.submenu);
      }

      this.submenu.append(child);
    },
    (child) => {
      if (this.submenu) {
        this.submenu.remove(child);
      }
    },
  );
  private readonly propsMapper = new PropertyMapper<MenuEntryProps>(
    this.lifecycle,
    createSizeRequestPropMapper(this.widget),
    createMarginPropMapper(this.widget),
    createExpandPropMapper(this.widget),
    createStylePropMapper(this.widget),
    createTooltipPropMapper(this.widget),
    createAccelPropMapper(this.widget, "activate"),
    (props) =>
      props.label(DataType.String, (v = "") => {
        this.widget.label = v;
      }),
  );

  constructor(props: DiffedProps) {
    this.handlers.bind("activate", "onActivate");
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

  setRootBarItem(barItem: MenuBarItemElement) {
    this.rootBarItem = barItem;

    this.children.forEach((child) => {
      child.setRootBarItem(barItem);
    });
  }

  getRadioGroup(groupName: string): Gtk.RadioMenuItem {
    return this.parent!.getRadioGroup(groupName);
  }

  reattachRadioButton(button: MenuRadioButtonElement) {
    this.children.reattachWidget(button);
  }

  updateProps(props: DiffedProps): void {
    this.lifecycle.emitLifecycleEventUpdate(props);
  }

  // #region This widget direct mutations

  appendChild(child: GjsElement | TextNode): void {
    ensureNotText(child);

    if (
      !GjsElementManager.isGjsElementOfKind(child, [
        MenuEntryElement,
        MenuRadioButtonElement,
        MenuCheckButtonElement,
      ])
    ) {
      throw new Error("Only MenuEntry can be a child of MenuEntry.");
    }

    const shouldAppend = child.notifyWillAppendTo(this);
    this.children.addChild(child, !shouldAppend);
    if (this.rootBarItem) {
      child.setRootBarItem(this.rootBarItem);
    }
    this.widget.show_all();
  }

  insertBefore(
    newChild: GjsElement | TextNode,
    beforeChild: GjsElement,
  ): void {
    ensureNotText(newChild);

    if (
      !GjsElementManager.isGjsElementOfKind(newChild, [
        MenuEntryElement,
        MenuRadioButtonElement,
        MenuCheckButtonElement,
      ])
    ) {
      throw new Error("Only MenuEntry can be a child of MenuEntry.");
    }

    const shouldAppend = newChild.notifyWillAppendTo(this);
    this.children.insertBefore(newChild, beforeChild, !shouldAppend);
    if (this.rootBarItem) {
      newChild.setRootBarItem(this.rootBarItem);
    }
    this.widget.show_all();
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
        "MenuBarItem can only be a child of a MenuBar or MenuEntry.",
      );
    }

    this.parent = parent;
    return true;
  }

  notifyWillUnmount(child: GjsElement): void {
    this.children.removeChild(child);

    if (this.children.count() === 0) {
      this.widget.set_submenu(null);
      this.submenu?.destroy();
      this.submenu = undefined;
    }
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

  addEventListener(
    signal: string,
    callback: Rg.GjsElementEvenTListenerCallback,
  ): void {
    return this.handlers.addListener(signal, callback);
  }

  removeEventListener(
    signal: string,
    callback: Rg.GjsElementEvenTListenerCallback,
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
    newProps: Record<string, any>,
  ): DiffedProps {
    return diffProps(oldProps, newProps, true);
  }

  // #endregion
}
