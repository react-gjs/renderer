import { DataType } from "dilswer";
import Gio from "gi://Gio";
import Gtk from "gi://Gtk";
import type { GjsContext } from "../../../../reconciler/gjs-renderer";
import type { HostContext } from "../../../../reconciler/host-context";
import type { GjsElement } from "../../../gjs-element";
import { GjsElementManager } from "../../../gjs-element-manager";
import { diffProps } from "../../../utils/diff-props";
import { ElementLifecycleController } from "../../../utils/element-extenders/element-lifecycle-controller";
import type { SyntheticEvent } from "../../../utils/element-extenders/event-handlers";
import { EventHandlers } from "../../../utils/element-extenders/event-handlers";
import type { DiffedProps } from "../../../utils/element-extenders/map-properties";
import { PropertyMapper } from "../../../utils/element-extenders/map-properties";
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
import type { RadioGroup } from "../utils/popover-radio-controller";
import { PopoverMenuEntryElement } from "./popover-menu-entry";

type PopoverMenuRadioButtonPropsMixin = SizeRequestProps &
  MarginProps &
  StyleProps &
  TooltipProps;

export type PopoverMenuRadioButtonEvent<P extends Record<string, any> = {}> =
  SyntheticEvent<P, PopoverMenuRadioButtonElement>;

export interface PopoverMenuRadioButtonProps
  extends PopoverMenuRadioButtonPropsMixin {
  label?: string;
  icon?: Rg.IconName;
  centered?: boolean;
  inverted?: boolean;
  radioGroup: string;
  isDefault?: boolean;
  onChange?: (e: PopoverMenuRadioButtonEvent<{ isActive: boolean }>) => void;
}

export class PopoverMenuRadioButtonElement
  implements GjsElement<"POPOVER_MENU_RADIO_BUTTON", Gtk.ModelButton>
{
  static getContext(
    currentContext: HostContext<GjsContext>
  ): HostContext<GjsContext> {
    return currentContext;
  }

  id = Symbol();

  readonly kind = "POPOVER_MENU_RADIO_BUTTON";
  private widget = popoverMenuModelButton();

  rootMenu: PopoverMenuElement | null = null;
  radioGroup: RadioGroup | null = null;

  private parent: PopoverMenuEntryElement | PopoverMenuContentElement | null =
    null;

  readonly lifecycle = new ElementLifecycleController();
  private readonly handlers = new EventHandlers<
    Gtk.ModelButton,
    PopoverMenuRadioButtonProps
  >(this);
  private readonly propsMapper =
    new PropertyMapper<PopoverMenuRadioButtonProps>(
      this.lifecycle,
      createSizeRequestPropMapper(this.widget),
      createMarginPropMapper(this.widget),
      createStylePropMapper(this.widget),
      createTooltipPropMapper(this.widget),
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
          .radioGroup(DataType.String, (v = "main", allProps) => {
            if (this.rootMenu) {
              const controller = this.rootMenu.getRadioController();

              if (this.radioGroup) {
                controller.removeFromGroup(this.radioGroup.name, this);
              }

              this.radioGroup = controller.addToGroup(
                v,
                this,
                allProps.isDefault
              );
              this.widget.active = this.radioGroup.isSelected(this);
            }
          })
    );

  constructor(props: DiffedProps) {
    this.widget.role = Gtk.ButtonRole.RADIO;

    this.handlers.bind("notify::active", "onChange", () => ({
      isActive: this.widget.active,
    }));

    this.handlers.bindInternal("clicked", (e) => {
      if (!this.widget.active) {
        this.radioGroup?.select(this);
      }
    });

    this.widget.get_child;

    this.updateProps(props);

    this.lifecycle.emitLifecycleEventAfterCreate();
  }

  setActiveState(active: boolean) {
    if (this.widget.active !== active) {
      this.widget.active = active;
    }
  }

  setParentMenu(name: string) {}

  setRootMenu(root: PopoverMenuElement) {
    this.rootMenu = root;

    if (this.propsMapper.currentProps.radioGroup) {
      const controller = this.rootMenu.getRadioController();
      this.radioGroup = controller.addToGroup(
        this.propsMapper.currentProps.radioGroup,
        this,
        this.propsMapper.currentProps.isDefault
      );
      this.widget.active = this.radioGroup.isSelected(this);
    }
  }

  updateProps(props: DiffedProps): void {
    this.lifecycle.emitLifecycleEventUpdate(props);
  }

  // #region This widget direct mutations

  appendChild(child: TextNode | GjsElement): void {
    throw new Error("PopoverMenuCheckButton cannot have children.");
  }

  insertBefore(child: TextNode | GjsElement, beforeChild: GjsElement): void {
    throw new Error("PopoverMenuCheckButton cannot have children.");
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
        PopoverMenuEntryElement,
        PopoverMenuContentElement,
      ])
    ) {
      throw new Error(
        "PopoverMenuCheckButton can only be appended to a Popover or another PopoverMenuEntry."
      );
    }
    this.parent = parent;
    return true;
  }

  notifyWillUnmount(child: GjsElement) {}

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
