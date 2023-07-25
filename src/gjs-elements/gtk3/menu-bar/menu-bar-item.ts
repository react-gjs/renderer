import { DataType } from "dilswer";
import Gtk from "gi://Gtk";
import { EventPhase } from "../../../reconciler/event-phase";
import type { GjsContext } from "../../../reconciler/gjs-renderer";
import type { HostContext } from "../../../reconciler/host-context";
import { BaseElement, type GjsElement } from "../../gjs-element";
import { GjsElementManager } from "../../gjs-element-manager";
import { ChildOrderController } from "../../utils/element-extenders/child-order-controller";
import { ElementLifecycleController } from "../../utils/element-extenders/element-lifecycle-controller";
import type { SyntheticEvent } from "../../utils/element-extenders/event-handlers";
import { EventHandlers } from "../../utils/element-extenders/event-handlers";
import type { DiffedProps } from "../../utils/element-extenders/map-properties";
import { PropertyMapper } from "../../utils/element-extenders/map-properties";
import { ensureNotText } from "../../utils/ensure-not-string";
import type { PointerData } from "../../utils/gdk-events/pointer-event";
import { parseCrossingEvent } from "../../utils/gdk-events/pointer-event";
import { mountAction } from "../../utils/mount-action";
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
import { MenuBarElement } from "./menu-bar";
import type { MenuItemElementType } from "./menu-elements";
import { MENU_ELEMENTS } from "./menu-elements";
import type { MenuRadioButtonElement } from "./menu-radio-button";

type MenuBarItemPropsMixin = ChildPropertiesProps &
  SizeRequestProps &
  MarginProps &
  ExpandProps &
  StyleProps &
  TooltipProps;

export type MenuBarItemEvent<P extends Record<string, any> = {}> =
  SyntheticEvent<P, MenuBarItemElement>;

export interface MenuBarItemProps extends MenuBarItemPropsMixin {
  label?: string;
  onMouseEnter?: (event: MenuBarItemEvent<PointerData>) => void;
  onMouseLeave?: (event: MenuBarItemEvent<PointerData>) => void;
}

export class MenuBarItemElement
  extends BaseElement
  implements GjsElement<"MENU_BAR_ITEM", Gtk.MenuItem>
{
  static getContext(
    currentContext: HostContext<GjsContext>,
  ): HostContext<GjsContext> {
    return currentContext;
  }

  readonly kind = "MENU_BAR_ITEM";
  protected widget = new Gtk.MenuItem();
  submenu = new Gtk.Menu();

  protected parent: MenuBarElement | null = null;

  readonly lifecycle = new ElementLifecycleController();
  protected readonly handlers = new EventHandlers<
    Gtk.MenuItem,
    MenuBarItemProps
  >(this);
  protected readonly children =
    new ChildOrderController<MenuItemElementType>(
      this.lifecycle,
      this.widget,
      (child) => {
        this.submenu.append(child);
      },
      (child) => {
        this.submenu.remove(child);
      },
    );
  protected readonly propsMapper =
    new PropertyMapper<MenuBarItemProps>(
      this.lifecycle,
      createSizeRequestPropMapper(this.widget),
      createMarginPropMapper(this.widget),
      createExpandPropMapper(this.widget),
      createStylePropMapper(this.widget),
      createTooltipPropMapper(this.widget),
      createChildPropsMapper(
        () => this.widget,
        () => this.parent,
      ),
      (props) =>
        props.label(DataType.String, (v = "") => {
          this.widget.label = v;
        }),
    );

  protected radioGroups = new Map<string, Gtk.RadioMenuItem>();

  constructor(props: DiffedProps) {
    super();
    this.widget.submenu = this.submenu;

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

  getRadioGroup(groupName: string): Gtk.RadioMenuItem {
    if (this.radioGroups.has(groupName)) {
      return this.radioGroups.get(groupName)!;
    }
    const radioGroup = new Gtk.RadioMenuItem();
    this.radioGroups.set(groupName, radioGroup);
    return radioGroup;
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

    if (!GjsElementManager.isGjsElementOfKind(child, MENU_ELEMENTS)) {
      throw new Error(
        "Only MenuEntry can be a child of MenuBarItem.",
      );
    }

    mountAction(
      this,
      child,
      (shouldOmitMount) => {
        this.children.addChild(child, shouldOmitMount);
        child.setRootBarItem(this);
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

    if (!GjsElementManager.isGjsElementOfKind(child, MENU_ELEMENTS)) {
      throw new Error(
        "Only MenuEntry can be a child of MenuBarItem.",
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
        child.setRootBarItem(this);
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
    if (
      !GjsElementManager.isGjsElementOfKind(parent, MenuBarElement)
    ) {
      throw new Error("MenuBarItem can only be a child of MenuBar.");
    }

    this.parent = parent;
    return true;
  }

  notifyMounted(): void {
    this.lifecycle.emitMountedEvent();
  }

  notifyChildWillUnmount(child: GjsElement): void {
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

  getWidget() {
    return this.widget;
  }

  getParentElement() {
    return this.parent;
  }

  // #endregion
}
