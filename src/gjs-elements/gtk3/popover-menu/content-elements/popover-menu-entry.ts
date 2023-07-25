import { DataType } from "dilswer";
import Gio from "gi://Gio";
import Gtk from "gi://Gtk";
import { EventPhase } from "../../../../reconciler/event-phase";
import type { GjsContext } from "../../../../reconciler/gjs-renderer";
import type { HostContext } from "../../../../reconciler/host-context";
import { BaseElement, type GjsElement } from "../../../gjs-element";
import { GjsElementManager } from "../../../gjs-element-manager";
import { ChildOrderController } from "../../../utils/element-extenders/child-order-controller";
import { ElementLifecycleController } from "../../../utils/element-extenders/element-lifecycle-controller";
import type { SyntheticEvent } from "../../../utils/element-extenders/event-handlers";
import { EventHandlers } from "../../../utils/element-extenders/event-handlers";
import type { DiffedProps } from "../../../utils/element-extenders/map-properties";
import { PropertyMapper } from "../../../utils/element-extenders/map-properties";
import { ensureNotText } from "../../../utils/ensure-not-string";
import type { PointerData } from "../../../utils/gdk-events/pointer-event";
import { parseCrossingEvent } from "../../../utils/gdk-events/pointer-event";
import { generateUID } from "../../../utils/generate-uid";
import { mountAction } from "../../../utils/mount-action";
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
import {
  POPOVER_MENU_MARGIN,
  popoverMenuModelButton,
} from "../utils/popover-menu-model-button";
import { PopoverMenuCheckButtonElement } from "./popover-menu-check-button";
import { PopoverMenuItemElement } from "./popover-menu-item";
import { PopoverMenuRadioButtonElement } from "./popover-menu-radio-button";
import { PopoverMenuSeparatorElement } from "./popover-menu-separator";

type PopoverMenuEntryPropsMixin = ChildPropertiesProps &
  SizeRequestProps &
  MarginProps &
  StyleProps &
  TooltipProps &
  AccelProps;

export type PopoverMenuEntryEvent<
  P extends Record<string, any> = {},
> = SyntheticEvent<P, PopoverMenuEntryElement>;

export interface PopoverMenuEntryProps
  extends PopoverMenuEntryPropsMixin {
  label?: string;
  icon?: Rg.IconName;
  centered?: boolean;
  inverted?: boolean;
  submenuBackButtonLabel?: string;
  onClick?: (e: PopoverMenuEntryEvent) => void;
  onPressed?: (event: PopoverMenuEntryEvent) => void;
  onReleased?: (event: PopoverMenuEntryEvent) => void;
  onMouseEnter?: (event: PopoverMenuEntryEvent<PointerData>) => void;
  onMouseLeave?: (event: PopoverMenuEntryEvent<PointerData>) => void;
}

export class PopoverMenuEntryElement
  extends BaseElement
  implements GjsElement<"POPOVER_MENU_ENTRY", Gtk.ModelButton>
{
  static getContext(
    currentContext: HostContext<GjsContext>,
  ): HostContext<GjsContext> {
    return currentContext;
  }

  static createSubmenu() {
    const submenu = new Gtk.Box({
      orientation: Gtk.Orientation.VERTICAL,
      margin: POPOVER_MENU_MARGIN,
    });

    const goBackButton = popoverMenuModelButton();
    goBackButton.text = "";
    goBackButton.inverted = true;
    goBackButton.centered = true;

    submenu.add(goBackButton);

    return {
      widget: submenu,
      goBackButton: goBackButton,
      isRegistered: false,
    };
  }

  readonly kind = "POPOVER_MENU_ENTRY";
  protected widget = popoverMenuModelButton();

  parentMenu = "main";
  rootMenu: PopoverMenuElement | null = null;

  ownMenuName: string;
  submenu = PopoverMenuEntryElement.createSubmenu();

  protected parent:
    | PopoverMenuEntryElement
    | PopoverMenuContentElement
    | null = null;

  readonly lifecycle = new ElementLifecycleController();
  protected readonly children = new ChildOrderController<
    | PopoverMenuItemElement
    | PopoverMenuEntryElement
    | PopoverMenuCheckButtonElement
    | PopoverMenuRadioButtonElement
    | PopoverMenuSeparatorElement
  >(this.lifecycle, this.submenu.widget);
  protected readonly handlers = new EventHandlers<
    Gtk.ModelButton,
    PopoverMenuEntryProps
  >(this);
  protected readonly propsMapper =
    new PropertyMapper<PopoverMenuEntryProps>(
      this.lifecycle,
      createSizeRequestPropMapper(this.widget),
      createMarginPropMapper(this.widget),
      createStylePropMapper(this.widget),
      createTooltipPropMapper(this.widget),
      createAccelPropMapper(this.widget, "clicked"),
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
          .submenuBackButtonLabel(DataType.String, (v = "") => {
            this.submenu.goBackButton.text = v;
          }),
    );

  constructor(
    props: DiffedProps,
    protected context: HostContext<GjsContext>,
  ) {
    super();
    this.ownMenuName = "submenu_" + generateUID(8);

    this.handlers.bind("clicked", "onClick");
    this.handlers.bind("pressed", "onPressed");
    this.handlers.bind("released", "onReleased");
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

  setParentMenu(name: string) {
    this.parentMenu = name;
    this.submenu.goBackButton.menu_name = name;
  }

  setRootMenu(root: PopoverMenuElement) {
    this.rootMenu = root;

    if (this.children.count() > 0) {
      this.registerSubmenu();
    }

    this.children.forEach((child) => {
      child.setRootMenu(root);
    });
  }

  registerSubmenu() {
    if (
      !this.submenu.isRegistered &&
      this.rootMenu &&
      this.children.count() > 0
    ) {
      this.widget.menu_name = this.ownMenuName;
      this.rootMenu.addSubMenu(this.submenu.widget, this.ownMenuName);
    }
  }

  unregisterSubmenu() {
    this.widget.menu_name = null;
    this.submenu.isRegistered = false;
  }

  updateProps(props: DiffedProps): void {
    this.lifecycle.emitLifecycleEventUpdate(props);
  }

  // #region This widget direct mutations

  appendChild(child: TextNode | GjsElement): void {
    if (
      !GjsElementManager.isGjsElementOfKind(child, [
        PopoverMenuItemElement,
        PopoverMenuEntryElement,
        PopoverMenuCheckButtonElement,
        PopoverMenuRadioButtonElement,
        PopoverMenuSeparatorElement,
      ])
    ) {
      throw new Error(
        "PopoverMenuEntry can only have PopoverMenuEntry as its children.",
      );
    }

    mountAction(this, child, (shouldOmitMount) => {
      child.setParentMenu(this.ownMenuName);
      if (this.rootMenu) {
        child.setRootMenu(this.rootMenu!);
      }

      this.children.addChild(child, shouldOmitMount);
      this.registerSubmenu();
    });
  }

  insertBefore(
    child: TextNode | GjsElement,
    beforeChild: GjsElement,
  ): void {
    ensureNotText(beforeChild);

    if (
      !GjsElementManager.isGjsElementOfKind(child, [
        PopoverMenuItemElement,
        PopoverMenuEntryElement,
        PopoverMenuCheckButtonElement,
        PopoverMenuRadioButtonElement,
        PopoverMenuSeparatorElement,
      ])
    ) {
      throw new Error(
        "PopoverMenuEntry can only have PopoverMenuEntry as its children.",
      );
    }

    mountAction(this, child, (shouldOmitMount) => {
      child.setParentMenu(this.ownMenuName);
      if (this.rootMenu) {
        child.setRootMenu(this.rootMenu!);
      }

      this.children.insertBefore(child, beforeChild, shouldOmitMount);
      this.registerSubmenu();
    });
  }

  remove(parent: GjsElement): void {
    parent.notifyChildWillUnmount(this);

    this.lifecycle.emitLifecycleEventBeforeDestroy();

    this.widget.destroy();
    this.submenu.widget.destroy();
    this.rootMenu?.removeSubMenu(this.ownMenuName);
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
        "PopoverMenuEntry can only be appended to a Popover or another PopoverMenuEntry.",
      );
    }
    this.parent = parent;
    return true;
  }

  notifyMounted(): void {
    this.lifecycle.emitMountedEvent();
  }

  notifyChildWillUnmount(child: GjsElement) {
    this.children.removeChild(child);
    if (this.children.count() === 0) {
      this.unregisterSubmenu();
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

  // #endregion
}
