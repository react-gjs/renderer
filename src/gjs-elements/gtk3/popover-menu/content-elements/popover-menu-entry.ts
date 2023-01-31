import { DataType } from "dilswer";
import Gio from "gi://Gio";
import Gtk from "gi://Gtk";
import type { GjsContext } from "../../../../reconciler/gjs-renderer";
import type { HostContext } from "../../../../reconciler/host-context";
import type { GjsElement } from "../../../gjs-element";
import { GjsElementManager } from "../../../gjs-element-manager";
import { diffProps } from "../../../utils/diff-props";
import { ChildOrderController } from "../../../utils/element-extenders/child-order-controller";
import { ElementLifecycleController } from "../../../utils/element-extenders/element-lifecycle-controller";
import type { SyntheticEvent } from "../../../utils/element-extenders/event-handlers";
import { EventHandlers } from "../../../utils/element-extenders/event-handlers";
import type { DiffedProps } from "../../../utils/element-extenders/map-properties";
import { PropertyMapper } from "../../../utils/element-extenders/map-properties";
import { ensureNotText } from "../../../utils/ensure-not-string";
import { generateUID } from "../../../utils/generate-uid";
import type { MarginProps } from "../../../utils/property-maps-factories/create-margin-prop-mapper";
import { createMarginPropMapper } from "../../../utils/property-maps-factories/create-margin-prop-mapper";
import type { StyleProps } from "../../../utils/property-maps-factories/create-style-prop-mapper";
import { createStylePropMapper } from "../../../utils/property-maps-factories/create-style-prop-mapper";
import type { TextNode } from "../../markup/text-node";
import type { PopoverMenuElement } from "../popover-menu";
import { PopoverMenuContentElement } from "../popover-menu-content";
import {
  popoverMenuModelButton,
  POPOVER_MENU_MARGIN,
} from "../utils/popover-menu-model-button";
import { PopoverMenuCheckButtonElement } from "./popover-menu-check-button";
import { PopoverMenuRadioButtonElement } from "./popover-menu-radio-button";
import { PopoverMenuSeparatorElement } from "./popover-menu-separator";

type PopoverMenuEntryPropsMixin = MarginProps & StyleProps;

export type PopoverMenuEntryEvent<P extends Record<string, any> = {}> =
  SyntheticEvent<P, PopoverMenuEntryElement>;

export interface PopoverMenuEntryProps extends PopoverMenuEntryPropsMixin {
  label?: string;
  icon?: Rg.IconName;
  centered?: boolean;
  inverted?: boolean;
  submenuBackButtonLabel?: string;
  onClick?: (e: PopoverMenuEntryEvent) => void;
}

export class PopoverMenuEntryElement
  implements GjsElement<"POPOVER_MENU_ENTRY", Gtk.ModelButton>
{
  static getContext(
    currentContext: HostContext<GjsContext>
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
  widget = popoverMenuModelButton();

  parentMenu = "main";
  rootMenu: PopoverMenuElement | null = null;

  ownMenuName: string;
  submenu = PopoverMenuEntryElement.createSubmenu();

  private parent: PopoverMenuEntryElement | PopoverMenuContentElement | null =
    null;

  readonly lifecycle = new ElementLifecycleController();
  private readonly children = new ChildOrderController<
    | PopoverMenuEntryElement
    | PopoverMenuCheckButtonElement
    | PopoverMenuRadioButtonElement
    | PopoverMenuSeparatorElement
  >(this.lifecycle, this.submenu.widget);
  private readonly handlers = new EventHandlers<
    Gtk.ModelButton,
    PopoverMenuEntryProps
  >(this);
  private readonly propsMapper = new PropertyMapper<PopoverMenuEntryProps>(
    this.lifecycle,
    createMarginPropMapper(this.widget),
    createStylePropMapper(this.widget),
    (props) =>
      props
        .label(DataType.String, (v = "") => {
          this.widget.text = v;
        })
        .icon(DataType.String, (v = "") => {
          this.widget.icon = Gio.Icon.new_for_string(v);
        })
        .centered(DataType.Boolean, (v = false) => {
          this.widget.centered = v;
        })
        .inverted(DataType.Boolean, (v = false) => {
          this.widget.inverted = v;
        })
        .submenuBackButtonLabel(DataType.String, (v = "") => {
          this.submenu.goBackButton.text = v;
        })
  );

  constructor(props: DiffedProps) {
    this.ownMenuName = "submenu_" + generateUID(8);

    this.handlers.bind("clicked", "onClick");

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
        PopoverMenuEntryElement,
        PopoverMenuCheckButtonElement,
        PopoverMenuRadioButtonElement,
        PopoverMenuSeparatorElement,
      ])
    ) {
      throw new Error(
        "PopoverMenuEntry can only have PopoverMenuEntry as its children."
      );
    }

    const shouldAppend = child.notifyWillAppendTo(this);

    child.setParentMenu(this.ownMenuName);
    if (this.rootMenu) {
      child.setRootMenu(this.rootMenu!);
    }

    this.children.addChild(child, !shouldAppend);
    this.registerSubmenu();
  }

  insertBefore(child: TextNode | GjsElement, beforeChild: GjsElement): void {
    ensureNotText(beforeChild);

    if (
      !GjsElementManager.isGjsElementOfKind(child, [
        PopoverMenuEntryElement,
        PopoverMenuCheckButtonElement,
        PopoverMenuRadioButtonElement,
        PopoverMenuSeparatorElement,
      ])
    ) {
      throw new Error(
        "PopoverMenuEntry can only have PopoverMenuEntry as its children."
      );
    }

    const shouldAppend = child.notifyWillAppendTo(this);

    child.setParentMenu(this.ownMenuName);
    if (this.rootMenu) {
      child.setRootMenu(this.rootMenu!);
    }

    this.children.insertBefore(child, beforeChild, !shouldAppend);
    this.registerSubmenu();
  }

  remove(parent: GjsElement): void {
    parent.notifyWillUnmount(this);

    this.lifecycle.emitLifecycleEventBeforeDestroy();

    this.widget.destroy();
    this.submenu.widget.destroy();
    this.rootMenu?.removeSubMenu(this.ownMenuName);
  }

  render() {
    this.parent?.widget.show_all();
  }

  // #endregion

  // #region Element internal signals

  notifyWillAppendTo(parent: GjsElement): boolean {
    if (
      !GjsElementManager.isGjsElementOfKind(parent, [
        PopoverMenuEntryElement,
        PopoverMenuContentElement,
      ])
    ) {
      throw new Error(
        "PopoverMenuEntry can only be appended to a Popover or another PopoverMenuEntry."
      );
    }
    this.parent = parent;
    return true;
  }

  notifyWillUnmount(child: GjsElement) {
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

  diffProps(
    oldProps: Record<string, any>,
    newProps: Record<string, any>
  ): DiffedProps {
    return diffProps(oldProps, newProps, true);
  }

  // #endregion
}
