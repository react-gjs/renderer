import type { GjsContext } from "../../../../reconciler/gjs-renderer";
import type { HostContext } from "../../../../reconciler/host-context";
import { BaseElement, type GjsElement } from "../../../gjs-element";
import { GjsElementManager } from "../../../gjs-element-manager";
import { ElementLifecycleController } from "../../../utils/element-extenders/element-lifecycle-controller";
import type { DiffedProps } from "../../../utils/element-extenders/map-properties";
import { PropertyMapper } from "../../../utils/element-extenders/map-properties";
import { ensureNotText } from "../../../utils/ensure-not-string";
import { mountAction } from "../../../utils/mount-action";
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
import { Bin } from "../../../utils/widgets/bin";
import type { TextNode } from "../../text-node";
import { PopoverMenuContentElement } from "../popover-menu-content";
import { PopoverMenuEntryElement } from "./popover-menu-entry";

type PopoverMenuItemPropsMixin = ChildPropertiesProps &
  SizeRequestProps &
  MarginProps &
  StyleProps &
  TooltipProps;

export type PopoverMenuItemProps = PopoverMenuItemPropsMixin;

export class PopoverMenuItemElement
  extends BaseElement
  implements GjsElement<"POPOVER_MENU_ITEM", Bin>
{
  static getContext(
    currentContext: HostContext<GjsContext>,
  ): HostContext<GjsContext> {
    return currentContext;
  }

  readonly kind = "POPOVER_MENU_ITEM";
  protected widget = new Bin();

  protected parent:
    | PopoverMenuEntryElement
    | PopoverMenuContentElement
    | null = null;

  protected readonly lifecycle = new ElementLifecycleController();
  protected handlers = null;
  protected readonly propsMapper =
    new PropertyMapper<PopoverMenuItemProps>(
      this.lifecycle,
      createSizeRequestPropMapper(this.widget),
      createMarginPropMapper(this.widget),
      createStylePropMapper(this.widget),
      createTooltipPropMapper(this.widget),
      createChildPropsMapper(
        () => this.widget,
        () => this.parent,
      ),
    );

  protected child: GjsElement | null = null;

  constructor(props: DiffedProps) {
    super();
    this.updateProps(props);

    this.lifecycle.emitLifecycleEventAfterCreate();
  }

  setParentMenu() {}

  setRootMenu() {}

  updateProps(props: DiffedProps): void {
    this.lifecycle.emitLifecycleEventUpdate(props);
  }

  // #region This widget direct mutations

  appendChild(child: TextNode | GjsElement): void {
    ensureNotText(child);

    if (this.child) {
      throw new Error("PopoverMenuItem can only have one child.");
    }

    mountAction(
      this,
      child,
      (shouldOmitMount) => {
        if (!shouldOmitMount) {
          this.child = child;
          this.widget.add(child.getWidget());
        }
      },
      () => {
        this.widget.show_all();
      },
    );
  }

  insertBefore(
    child: TextNode | GjsElement,
    beforeChild: GjsElement,
  ): void {
    mountAction(this, child, (shouldOmitMount) => {
      if (!shouldOmitMount) {
        throw new Error("PopoverMenuItem can only have one child.");
      }
    });
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

  notifyChildWillUnmount(child: GjsElement) {
    if (child === this.child) {
      this.child = null;
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
