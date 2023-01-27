import { DataType } from "dilswer";
import Gio from "gi://Gio";
import Gtk from "gi://Gtk";
import { EntryPosition } from "../../../../g-enums";
import type { GjsContext } from "../../../../reconciler/gjs-renderer";
import type { HostContext } from "../../../../reconciler/host-context";
import type { GjsElement } from "../../../gjs-element";
import { GjsElementManager } from "../../../gjs-element-manager";
import { diffProps } from "../../../utils/diff-props";
import { ChildOrderController } from "../../../utils/element-extenders/child-order-controller";
import { ElementLifecycleController } from "../../../utils/element-extenders/element-lifecycle-controller";
import { EventHandlers } from "../../../utils/element-extenders/event-handlers";
import type { DiffedProps } from "../../../utils/element-extenders/map-properties";
import { PropertyMapper } from "../../../utils/element-extenders/map-properties";
import { ensureNotText } from "../../../utils/ensure-not-string";
import type { IconName } from "../../../utils/icons/icon-types";
import type { AlignmentProps } from "../../../utils/property-maps-factories/create-alignment-prop-mapper";
import { createAlignmentPropMapper } from "../../../utils/property-maps-factories/create-alignment-prop-mapper";
import type { MarginProps } from "../../../utils/property-maps-factories/create-margin-prop-mapper";
import { createMarginPropMapper } from "../../../utils/property-maps-factories/create-margin-prop-mapper";
import type { StyleProps } from "../../../utils/property-maps-factories/create-style-prop-mapper";
import { createStylePropMapper } from "../../../utils/property-maps-factories/create-style-prop-mapper";
import type { TextNode } from "../../markup/text-node";
import type { PopoverMenuElement } from "../popover-menu";
import { PopoverMenuContentElement } from "../popover-menu-content";

type PopoverMenuEntryPropsMixin = AlignmentProps & MarginProps & StyleProps;

export interface PopoverMenuEntryProps extends PopoverMenuEntryPropsMixin {
  label?: string;
  icon?: IconName;
  position?: EntryPosition;
  submenuName?: string;
  submenuBackButtonLabel?: string;
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
      margin: 10,
    });

    const goBackButton = new Gtk.ModelButton();
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
  widget = new Gtk.ModelButton();

  parentMenuName = "main";
  ownMenuName = "";
  submenu = PopoverMenuEntryElement.createSubmenu();

  private parent: PopoverMenuEntryElement | PopoverMenuContentElement | null =
    null;

  private readonly lifecycle = new ElementLifecycleController();
  private readonly children = new ChildOrderController<PopoverMenuEntryElement>(
    this.lifecycle,
    this.submenu.widget
  );
  private readonly handlers = new EventHandlers<
    Gtk.ModelButton,
    PopoverMenuEntryProps
  >(this.lifecycle, this.widget);
  private readonly propsMapper = new PropertyMapper<PopoverMenuEntryProps>(
    this.lifecycle,
    createAlignmentPropMapper(this.widget),
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
        .position(DataType.Enum(EntryPosition), (v = EntryPosition.LEFT) => {
          switch (v) {
            case EntryPosition.LEFT:
              this.widget.centered = false;
              this.widget.inverted = false;
              break;
            case EntryPosition.CENTER:
              this.widget.centered = true;
              this.widget.inverted = false;
              break;
            case EntryPosition.RIGHT:
              this.widget.centered = false;
              this.widget.inverted = true;
              break;
          }
        })
        .submenuName(DataType.String, (v) => {
          if (v) {
            this.ownMenuName = v;
            this.widget.menu_name = v;
            this.submenu.goBackButton.menu_name = v;
            this.children.forEach((child) => {
              child.setParentMenu(v);
            });
            this.registerSubmenu();
          } else {
            this.widget.menu_name = null;
            this.children.forEach((child) => {
              child.setParentMenu(this.parentMenuName);
            });
          }
        })
        .submenuBackButtonLabel(DataType.String, (v = "") => {
          this.submenu.goBackButton.text = v;
        })
  );

  constructor(props: DiffedProps) {
    this.updateProps(props);

    this.lifecycle.emitLifecycleEventAfterCreate();
  }

  setParentMenu(name: string) {
    this.submenu.goBackButton.menu_name = name;

    if (!this.ownMenuName) {
      this.children.forEach((child) => {
        child.setParentMenu(name);
      });
    }
  }

  getMenu(): PopoverMenuElement | null {
    return this.getMenu();
  }

  registerSubmenu() {
    if (
      !this.submenu.isRegistered &&
      this.parent &&
      this.propsMapper.currentProps.submenuName
    ) {
      this.parent!.getMenu()!.addSubMenu(
        this.submenu.widget,
        this.propsMapper.currentProps.submenuName
      );
    }
  }

  updateProps(props: DiffedProps): void {
    this.lifecycle.emitLifecycleEventUpdate(props);
  }

  // #region This widget direct mutations

  appendChild(child: TextNode | GjsElement): void {
    if (!GjsElementManager.isGjsElementOfKind(child, PopoverMenuEntryElement)) {
      throw new Error(
        "PopoverMenuEntry can only have PopoverMenuEntry as its children."
      );
    }

    const shouldAppend = child.notifyWillAppendTo(this);
    child.setParentMenu(this.ownMenuName || this.parentMenuName);
    this.children.addChild(child, shouldAppend);
    this.widget.show_all();
  }

  insertBefore(child: TextNode | GjsElement, beforeChild: GjsElement): void {
    ensureNotText(beforeChild);

    if (!GjsElementManager.isGjsElementOfKind(child, PopoverMenuEntryElement)) {
      throw new Error(
        "PopoverMenuEntry can only have PopoverMenuEntry as its children."
      );
    }

    const shouldAppend = child.notifyWillAppendTo(this);
    child.setParentMenu(this.ownMenuName || this.parentMenuName);
    this.children.insertBefore(child, beforeChild, shouldAppend);
    this.widget.show_all();
  }

  remove(parent: GjsElement): void {
    parent.notifyWillUnmount(this);

    this.lifecycle.emitLifecycleEventBeforeDestroy();

    this.widget.destroy();
    this.submenu.widget.destroy();
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

    this.registerSubmenu();

    return true;
  }

  notifyWillUnmount(child: GjsElement) {
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
