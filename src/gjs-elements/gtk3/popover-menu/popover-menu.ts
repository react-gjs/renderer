import { DataType } from "dilswer";
import type Gtk from "gi://Gtk";
import { PopoverConstraint, PositionType } from "../../../g-enums";
import type { GjsContext } from "../../../reconciler/gjs-renderer";
import type { HostContext } from "../../../reconciler/host-context";
import type { GjsElement } from "../../gjs-element";
import { GjsElementManager } from "../../gjs-element-manager";
import { diffProps } from "../../utils/diff-props";
import { ElementLifecycleController } from "../../utils/element-extenders/element-lifecycle-controller";
import { EventHandlers } from "../../utils/element-extenders/event-handlers";
import type { DiffedProps } from "../../utils/element-extenders/map-properties";
import { PropertyMapper } from "../../utils/element-extenders/map-properties";
import type { AlignmentProps } from "../../utils/property-maps-factories/create-alignment-prop-mapper";
import { createAlignmentPropMapper } from "../../utils/property-maps-factories/create-alignment-prop-mapper";
import type { ExpandProps } from "../../utils/property-maps-factories/create-expand-prop-mapper";
import { createExpandPropMapper } from "../../utils/property-maps-factories/create-expand-prop-mapper";
import type { MarginProps } from "../../utils/property-maps-factories/create-margin-prop-mapper";
import { createMarginPropMapper } from "../../utils/property-maps-factories/create-margin-prop-mapper";
import type { StyleProps } from "../../utils/property-maps-factories/create-style-prop-mapper";
import { createStylePropMapper } from "../../utils/property-maps-factories/create-style-prop-mapper";
import { Bin } from "../../utils/widgets/bin";
import type { TextNode } from "../markup/text-node";
import { PopoverMenuContentElement } from "./popover-menu-content";
import { PopoverMenuTargetElement } from "./popover-menu-target";

type PopoverMenuPropsMixin = AlignmentProps &
  MarginProps &
  ExpandProps &
  StyleProps;

export interface PopoverMenuProps extends PopoverMenuPropsMixin {
  isModal?: boolean;
  constraint?: PopoverConstraint;
  position?: PositionType;
}

export type PopoverInternalProps = {
  popoverWidget: Gtk.PopoverMenu;
};

export class PopoverMenuElement implements GjsElement<"POPOVER_MENU", Bin> {
  static getContext(
    currentContext: HostContext<GjsContext>
  ): HostContext<GjsContext> {
    return currentContext;
  }

  readonly kind = "POPOVER_MENU";
  widget = new Bin();
  popover!: Gtk.PopoverMenu;

  ownMenuName = "main";

  submenus = new Set<string>();

  private parent: GjsElement | null = null;

  private readonly lifecycle = new ElementLifecycleController();
  private readonly handlers: EventHandlers<Gtk.Popover, PopoverMenuProps>;
  private readonly propsMapper = new PropertyMapper<
    PopoverMenuProps & PopoverInternalProps
  >(
    this.lifecycle,
    createAlignmentPropMapper(this.widget),
    createMarginPropMapper(this.widget),
    createExpandPropMapper(this.widget),
    createStylePropMapper(this.widget),
    (props) =>
      props
        .popoverWidget(DataType.Unknown, (popoverWidget) => {
          this.popover = popoverWidget as Gtk.PopoverMenu;
          this.popover.set_relative_to(this.widget);
        })
        .isModal(DataType.Boolean, (v = false) => {
          this.popover.set_modal(v);
        })
        .constraint(
          DataType.Enum(PopoverConstraint),
          (v = PopoverConstraint.NONE) => {
            this.popover.set_constrain_to(v);
          }
        )
        .position(DataType.Enum(PositionType), (v = PositionType.TOP) => {
          this.popover.set_position(v);
        })
  );

  private hasContentChild = false;
  private contentElement?: PopoverMenuContentElement;
  private hasTarget = false;
  private targetElement?: PopoverMenuTargetElement;

  constructor(props: DiffedProps) {
    this.propsMapper.skipDefaults();
    this.updateProps(props);

    this.handlers = new EventHandlers(this.lifecycle, this.popover);

    this.lifecycle.emitLifecycleEventAfterCreate();
  }

  addSubMenu(subMenu: Gtk.Box, name: string) {
    if (this.submenus.has(name)) return;

    this.popover.add(subMenu);
    this.popover.child_set_property(subMenu, "submenu", name);
    this.submenus.add(name);
  }

  removeSubMenu(name: string) {
    this.submenus.delete(name);
  }

  onContentChange() {
    if (this.targetElement) this.popover.add(this.targetElement.widget);
  }

  onTargetChange() {
    if (this.contentElement) this.widget.add(this.contentElement.widget);
  }

  updateProps(props: DiffedProps): void {
    this.lifecycle.emitLifecycleEventUpdate(props);
  }

  // #region This widget direct mutations

  appendChild(child: GjsElement | TextNode): void {
    if (
      GjsElementManager.isGjsElementOfKind(child, PopoverMenuContentElement)
    ) {
      if (this.hasContentChild) {
        throw new Error("Popover can only have one child");
      }
      const shouldAppend = child.notifyWillAppendTo(this);
      if (shouldAppend) {
        this.popover.add(child.widget);
        this.hasContentChild = true;
        this.contentElement = child;
        child.setParentMenu(this.ownMenuName);
        child.setRootMenu(this);
      }
    } else if (
      GjsElementManager.isGjsElementOfKind(child, PopoverMenuTargetElement)
    ) {
      if (this.hasTarget) {
        throw new Error("Popover can only have one target");
      }
      const shouldAppend = child.notifyWillAppendTo(this);
      if (shouldAppend) {
        this.widget.add(child.widget);
        this.hasTarget = true;
        this.targetElement = child;
        this.popover.relative_to = child.widget;
      }
    } else {
      throw new Error(
        "Popover can only have one PopoverTarget and one PopoverContent as it's children."
      );
    }
  }

  insertBefore(newChild: GjsElement | TextNode): void {
    // TODO: proper handling of insertBefore
    this.appendChild(newChild);
  }

  remove(parent: GjsElement): void {
    parent.notifyWillUnmount(this);

    this.lifecycle.emitLifecycleEventBeforeDestroy();

    this.widget.destroy();
    this.popover.destroy();
  }

  render() {
    this.parent?.widget.show_all();
  }

  // #endregion

  // #region Element internal signals

  notifyWillAppendTo(parent: GjsElement): boolean {
    this.parent = parent;
    return true;
  }

  notifyWillUnmount(child: GjsElement): void {
    if (
      GjsElementManager.isGjsElementOfKind(child, PopoverMenuContentElement)
    ) {
      this.hasContentChild = false;
      this.contentElement = undefined;
    } else if (
      GjsElementManager.isGjsElementOfKind(child, PopoverMenuTargetElement)
    ) {
      this.hasTarget = false;
      this.targetElement = undefined;
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
