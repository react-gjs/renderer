import Gtk from "gi://Gtk";
import type { GjsContext } from "../../../../reconciler/gjs-renderer";
import type { HostContext } from "../../../../reconciler/host-context";
import { BaseElement, type GjsElement } from "../../../gjs-element";
import { GjsElementManager } from "../../../gjs-element-manager";
import { ElementLifecycleController } from "../../../utils/element-extenders/element-lifecycle-controller";
import type { SyntheticEvent } from "../../../utils/element-extenders/event-handlers";
import { EventHandlers } from "../../../utils/element-extenders/event-handlers";
import type { DiffedProps } from "../../../utils/element-extenders/map-properties";
import { PropertyMapper } from "../../../utils/element-extenders/map-properties";
import type { ChildPropertiesProps } from "../../../utils/property-maps-factories/create-child-props-mapper";
import { createChildPropsMapper } from "../../../utils/property-maps-factories/create-child-props-mapper";
import type { MarginProps } from "../../../utils/property-maps-factories/create-margin-prop-mapper";
import { createMarginPropMapper } from "../../../utils/property-maps-factories/create-margin-prop-mapper";
import type { SizeRequestProps } from "../../../utils/property-maps-factories/create-size-request-prop-mapper";
import { createSizeRequestPropMapper } from "../../../utils/property-maps-factories/create-size-request-prop-mapper";
import type { StyleProps } from "../../../utils/property-maps-factories/create-style-prop-mapper";
import { createStylePropMapper } from "../../../utils/property-maps-factories/create-style-prop-mapper";
import type { TextNode } from "../../text-node";
import type { PopoverMenuElement } from "../popover-menu";
import { PopoverMenuContentElement } from "../popover-menu-content";
import { PopoverMenuEntryElement } from "./popover-menu-entry";

type PopoverMenuSeparatorPropsMixin = ChildPropertiesProps &
  SizeRequestProps &
  MarginProps &
  StyleProps;

export type PopoverMenuSeparatorEvent<
  P extends Record<string, any> = {},
> = SyntheticEvent<P, PopoverMenuSeparatorElement>;

export type PopoverMenuSeparatorProps =
  PopoverMenuSeparatorPropsMixin;

export class PopoverMenuSeparatorElement
  extends BaseElement
  implements GjsElement<"POPOVER_MENU_SEPARATOR", Gtk.Separator>
{
  static getContext(
    currentContext: HostContext<GjsContext>,
  ): HostContext<GjsContext> {
    return currentContext;
  }

  readonly kind = "POPOVER_MENU_SEPARATOR";
  protected widget = new Gtk.Separator();

  protected parent:
    | PopoverMenuEntryElement
    | PopoverMenuContentElement
    | null = null;

  readonly lifecycle = new ElementLifecycleController();
  protected readonly handlers = new EventHandlers<
    Gtk.Separator,
    PopoverMenuSeparatorProps
  >(this);
  protected readonly propsMapper =
    new PropertyMapper<PopoverMenuSeparatorProps>(
      this.lifecycle,
      createSizeRequestPropMapper(this.widget),
      createMarginPropMapper(this.widget),
      createStylePropMapper(this.widget),
      createChildPropsMapper(
        () => this.widget,
        () => this.parent,
      ),
    );

  constructor(props: DiffedProps) {
    super();
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
    throw new Error("PopoverMenuSeparator cannot have children.");
  }

  insertBefore(
    child: TextNode | GjsElement,
    beforeChild: GjsElement,
  ): void {
    throw new Error("PopoverMenuSeparator cannot have children.");
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
        "PopoverMenuEntry can only be appended to a Popover or another PopoverMenuEntry.",
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
