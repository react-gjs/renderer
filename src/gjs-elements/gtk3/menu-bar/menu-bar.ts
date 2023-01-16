import Gtk from "gi://Gtk";
import type { GjsContext } from "../../../reconciler/gjs-renderer";
import type { HostContext } from "../../../reconciler/host-context";
import type { GjsElement } from "../../gjs-element";
import { GjsElementManager } from "../../gjs-element-manager";
import { diffProps } from "../../utils/diff-props";
import { ChildOrderController } from "../../utils/element-extenders/child-order-controller";
import { ElementLifecycleController } from "../../utils/element-extenders/element-lifecycle-controller";
import type { DiffedProps } from "../../utils/element-extenders/map-properties";
import { PropertyMapper } from "../../utils/element-extenders/map-properties";
import { ensureNotText } from "../../utils/ensure-not-string";
import type { IconName } from "../../utils/icons/icon-types";
import type { AlignmentProps } from "../../utils/property-maps-factories/create-alignment-prop-mapper";
import { createAlignmentPropMapper } from "../../utils/property-maps-factories/create-alignment-prop-mapper";
import type { ExpandProps } from "../../utils/property-maps-factories/create-expand-prop-mapper";
import { createExpandPropMapper } from "../../utils/property-maps-factories/create-expand-prop-mapper";
import type { MarginProps } from "../../utils/property-maps-factories/create-margin-prop-mapper";
import { createMarginPropMapper } from "../../utils/property-maps-factories/create-margin-prop-mapper";
import type { StyleProps } from "../../utils/property-maps-factories/create-style-prop-mapper";
import { createStylePropMapper } from "../../utils/property-maps-factories/create-style-prop-mapper";
import type { TextNode } from "../markup/text-node";
import { MenuBarItemElement } from "./menu-bar-item";

type MenuBarPropsMixin = AlignmentProps &
  MarginProps &
  ExpandProps &
  StyleProps;

export interface MenuBarProps extends MenuBarPropsMixin {
  label?: string;
  icon?: IconName;
}

export class MenuBarElement implements GjsElement<"MENU_BAR", Gtk.MenuBar> {
  static getContext(
    currentContext: HostContext<GjsContext>
  ): HostContext<GjsContext> {
    return currentContext;
  }

  readonly kind = "MENU_BAR";
  widget = new Gtk.MenuBar();

  private parent: GjsElement | null = null;

  private readonly lifecycle = new ElementLifecycleController();
  private readonly children = new ChildOrderController<MenuBarItemElement>(
    this.lifecycle,
    this.widget,
    (child) => {
      this.widget.append(child);
    }
  );
  private readonly propsMapper = new PropertyMapper<MenuBarProps>(
    this.lifecycle,
    createAlignmentPropMapper(this.widget),
    createMarginPropMapper(this.widget),
    createExpandPropMapper(this.widget),
    createStylePropMapper(this.widget)
  );

  private radioGroups = new Map<string, Gtk.RadioToolButton>();

  constructor(props: DiffedProps) {
    this.updateProps(props);

    this.lifecycle.emitLifecycleEventAfterCreate();
  }

  getRadioGroup(groupName: string): Gtk.RadioToolButton {
    if (this.radioGroups.has(groupName)) {
      return this.radioGroups.get(groupName)!;
    }
    const radioGroup = new Gtk.RadioToolButton();
    this.radioGroups.set(groupName, radioGroup);
    return radioGroup;
  }

  updateProps(props: DiffedProps): void {
    this.lifecycle.emitLifecycleEventUpdate(props);
  }

  // #region This widget direct mutations

  appendChild(child: GjsElement | TextNode): void {
    ensureNotText(child);

    if (!GjsElementManager.isGjsElementOfKind(child, MenuBarItemElement)) {
      throw new Error("Only MenuBarItem can be a child of MenuBar.");
    }

    const shouldAppend = child.notifyWillAppendTo(this);
    this.children.addChild(child, !shouldAppend);
    this.widget.show_all();
  }

  insertBefore(newChild: GjsElement | TextNode, beforeChild: GjsElement): void {
    ensureNotText(newChild);

    if (!GjsElementManager.isGjsElementOfKind(newChild, MenuBarItemElement)) {
      throw new Error("Only MenuBarItem can be a child of MenuBar.");
    }

    const shouldAppend = newChild.notifyWillAppendTo(this);
    this.children.insertBefore(newChild, beforeChild, !shouldAppend);
    this.widget.show_all();
  }

  remove(parent: GjsElement): void {
    parent.notifyWillUnmount(this);

    this.lifecycle.emitLifecycleEventBeforeDestroy();

    this.widget.destroy();
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
