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
import { parseCrossingEvent } from "../../utils/gdk-events/pointer-event";
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

type MenuRadioButtonPropsMixin = SizeRequestProps &
  MarginProps &
  ExpandProps &
  StyleProps &
  TooltipProps;

export type MenuRadioButtonEvent<P extends Record<string, any> = {}> =
  SyntheticEvent<P, MenuRadioButtonElement>;

export interface MenuRadioButtonProps extends MenuRadioButtonPropsMixin {
  /** Main text of the menu entry, displayed on the left side. */
  label?: string;
  radioGroup: string;
  isDefault?: boolean;
  inconsistent?: boolean;
  onClick?: (event: MenuRadioButtonEvent) => void;
  onToggle?: (event: MenuRadioButtonEvent<{ value: boolean }>) => void;
  onMouseEnter?: (event: MenuRadioButtonEvent<PointerEvent>) => void;
  onMouseLeave?: (event: MenuRadioButtonEvent<PointerEvent>) => void;
}

export class MenuRadioButtonElement
  implements GjsElement<"MENU_RADIO_BUTTON", Gtk.RadioMenuItem>
{
  static getContext(
    currentContext: HostContext<GjsContext>
  ): HostContext<GjsContext> {
    return currentContext;
  }

  readonly kind = "MENU_RADIO_BUTTON";
  private widget = new Gtk.RadioMenuItem();

  private parent: MenuBarItemElement | MenuEntryElement | null = null;

  readonly lifecycle = new ElementLifecycleController();
  private handlers = new EventHandlers<Gtk.MenuItem, MenuRadioButtonProps>(
    this
  );

  private readonly propsMapper = new PropertyMapper<MenuRadioButtonProps>(
    this.lifecycle
  );

  private isInitialized = false;
  private unappliedProps: DiffedProps = [];

  constructor(props: DiffedProps) {
    this.updateProps(props);

    this.lifecycle.emitLifecycleEventAfterCreate();
  }

  updateProps(props: DiffedProps): void {
    if (this.isInitialized) {
      this.lifecycle.emitLifecycleEventUpdate(props);
    } else {
      for (const prop of props) {
        this.unappliedProps = this.unappliedProps.filter(
          ([name]) => name !== prop[0]
        );
        this.unappliedProps.push(prop);
      }
    }
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
      GjsElementManager.isGjsElementOfKind(parent, [
        MenuBarItemElement,
        MenuEntryElement,
      ])
    ) {
      this.parent = parent;

      const radioGroup = parent.getRadioGroup(
        this.propsMapper.currentProps.radioGroup!
      );

      this.widget = Gtk.RadioToolButton.new_from_widget(
        radioGroup
      ) as any as Gtk.RadioMenuItem;

      this.isInitialized = true;

      this.propsMapper.addCases(
        createSizeRequestPropMapper(this.widget),
        createMarginPropMapper(this.widget),
        createExpandPropMapper(this.widget),
        createStylePropMapper(this.widget),
        createTooltipPropMapper(this.widget),
        (props) =>
          props
            .label(DataType.String, (v = "") => {
              this.widget.label = v;
            })
            .inconsistent(DataType.Boolean, (v = false) => {
              this.widget.inconsistent = v;
            })
      );

      this.handlers = new EventHandlers<
        Gtk.RadioMenuItem,
        MenuRadioButtonProps
      >(this);

      this.handlers.bind("clicked", "onClick");
      this.handlers.bind("toggled", "onToggle", () => {
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

      this.lifecycle.emitLifecycleEventUpdate(this.unappliedProps);
      this.unappliedProps = [];

      if (this.propsMapper.currentProps.isDefault) {
        this.widget.set_active(true);
      }
    } else {
      throw new Error("ToolbarButton can only be a child of a toolbar.");
    }

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
