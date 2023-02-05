import { DataType } from "dilswer";
import Gtk from "gi://Gtk";
import { EventPhase } from "../../../reconciler/event-phase";
import type { GjsContext } from "../../../reconciler/gjs-renderer";
import type { HostContext } from "../../../reconciler/host-context";
import type { GjsElement } from "../../gjs-element";
import { GjsElementManager } from "../../gjs-element-manager";
import { diffProps } from "../../utils/diff-props";
import { ChildOrderController } from "../../utils/element-extenders/child-order-controller";
import { ElementLifecycleController } from "../../utils/element-extenders/element-lifecycle-controller";
import type { SyntheticEvent } from "../../utils/element-extenders/event-handlers";
import { EventHandlers } from "../../utils/element-extenders/event-handlers";
import type { DiffedProps } from "../../utils/element-extenders/map-properties";
import { PropertyMapper } from "../../utils/element-extenders/map-properties";
import { ensureNotText } from "../../utils/ensure-not-string";
import { parseCrossingEvent } from "../../utils/gdk-events/pointer-event";
import type { ExpandProps } from "../../utils/property-maps-factories/create-expand-prop-mapper";
import { createExpandPropMapper } from "../../utils/property-maps-factories/create-expand-prop-mapper";
import type { MarginProps } from "../../utils/property-maps-factories/create-margin-prop-mapper";
import { createMarginPropMapper } from "../../utils/property-maps-factories/create-margin-prop-mapper";
import type { SizeRequestProps } from "../../utils/property-maps-factories/create-size-request-prop-mapper";
import { createSizeRequestPropMapper } from "../../utils/property-maps-factories/create-size-request-prop-mapper";
import type { StyleProps } from "../../utils/property-maps-factories/create-style-prop-mapper";
import { createStylePropMapper } from "../../utils/property-maps-factories/create-style-prop-mapper";
import type { TextNode } from "../markup/text-node";
import { escapeHtml } from "../markup/utils/escape-html";
import { MenuBarItemElement } from "./menu-bar-item";
import { MenuCheckButtonElement } from "./menu-check-button";

type MenuEntryPropsMixin = SizeRequestProps &
  MarginProps &
  ExpandProps &
  StyleProps;

export type MenuEntryEvent<P extends Record<string, any> = {}> = SyntheticEvent<
  P,
  MenuEntryElement
>;

export interface MenuEntryProps extends MenuEntryPropsMixin {
  /** Main text of the menu entry, displayed on the left side. */
  label?: string;

  /**
   * Secondary text of the menu entry, displayed on the right side. It
   * is displayed in a dimmed color.
   */
  secondaryLabel?: string;
  onActivate?: (event: MenuEntryEvent) => void;
  onMouseEnter?: (event: MenuEntryEvent<PointerEvent>) => void;
  onMouseLeave?: (event: MenuEntryEvent<PointerEvent>) => void;
}

export class MenuEntryElement
  implements GjsElement<"MENU_ENTRY", Gtk.MenuItem>
{
  static getContext(
    currentContext: HostContext<GjsContext>
  ): HostContext<GjsContext> {
    return currentContext;
  }

  readonly kind = "MENU_ENTRY";
  private widget = new Gtk.MenuItem();

  submenu?: Gtk.Menu;
  labelContainer = new Gtk.Box();

  private parent: MenuBarItemElement | MenuEntryElement | null = null;

  readonly lifecycle = new ElementLifecycleController();
  private readonly handlers = new EventHandlers<Gtk.MenuItem, MenuEntryProps>(
    this
  );
  private readonly children = new ChildOrderController<
    MenuEntryElement | MenuCheckButtonElement
  >(this.lifecycle, this.widget, (child) => {
    if (!this.submenu) {
      this.submenu = new Gtk.Menu();
      this.widget.set_submenu(this.submenu);
    }

    this.submenu.append(child);
  });
  private readonly propsMapper = new PropertyMapper<MenuEntryProps>(
    this.lifecycle,
    createSizeRequestPropMapper(this.widget),
    createMarginPropMapper(this.widget),
    createExpandPropMapper(this.widget),
    createStylePropMapper(this.widget),
    (props) =>
      props
        .label(DataType.String, (v = "", allProps) => {
          this.labelContainer.destroy();
          this.labelContainer = this.createLabel(
            v,
            allProps.secondaryLabel ?? ""
          );
          this.widget.add(this.labelContainer);
        })
        .secondaryLabel(DataType.String, (v = "", allProps) => {
          this.labelContainer.destroy();
          this.labelContainer = this.createLabel(allProps.label ?? "", v);
          this.widget.add(this.labelContainer);
        })
  );

  constructor(props: DiffedProps) {
    this.handlers.bind("activate", "onActivate");
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

    this.updateProps(props);

    this.lifecycle.emitLifecycleEventAfterCreate();
  }

  private createLabel(leftText: string, rightText: string) {
    const box = new Gtk.Box();
    box.orientation = Gtk.Orientation.HORIZONTAL;

    const leftLabel = new Gtk.Label({ label: leftText });
    leftLabel.expand = true;
    leftLabel.halign = Gtk.Align.START;
    box.add(leftLabel);

    if (rightText !== "") {
      const rightLabel = new Gtk.Label({
        label: `<span alpha="50%">${escapeHtml(rightText)}</span>`,
        use_markup: true,
      });
      rightLabel.halign = Gtk.Align.END;
      rightLabel.margin_start = 10;
      rightLabel.margin_end = 10;
      box.add(rightLabel);
    }

    return box;
  }

  getRadioGroup(groupName: string): Gtk.RadioToolButton {
    return this.parent!.getRadioGroup(groupName);
  }

  updateProps(props: DiffedProps): void {
    this.lifecycle.emitLifecycleEventUpdate(props);
  }

  // #region This widget direct mutations

  appendChild(child: GjsElement | TextNode): void {
    ensureNotText(child);

    if (
      !GjsElementManager.isGjsElementOfKind(child, [
        MenuEntryElement,
        MenuCheckButtonElement,
      ])
    ) {
      throw new Error("Only MenuEntry can be a child of MenuEntry.");
    }

    const shouldAppend = child.notifyWillAppendTo(this);
    this.children.addChild(child, !shouldAppend);
    this.widget.show_all();
  }

  insertBefore(newChild: GjsElement | TextNode, beforeChild: GjsElement): void {
    ensureNotText(newChild);

    if (
      !GjsElementManager.isGjsElementOfKind(newChild, [
        MenuEntryElement,
        MenuCheckButtonElement,
      ])
    ) {
      throw new Error("Only MenuEntry can be a child of MenuEntry.");
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
    this.parent?.getWidget().show_all();
  }

  // #endregion

  // #region Element internal signals

  notifyWillAppendTo(parent: GjsElement): boolean {
    if (
      !GjsElementManager.isGjsElementOfKind(parent, [
        MenuBarItemElement,
        MenuEntryElement,
      ])
    ) {
      throw new Error(
        "MenuBarItem can only be a child of a MenuBar or MenuEntry."
      );
    }

    this.parent = parent;
    return true;
  }

  notifyWillUnmount(child: GjsElement): void {
    this.children.removeChild(child);

    if (this.children.count() === 0) {
      this.widget.set_submenu(null);
      this.submenu?.destroy();
      this.submenu = undefined;
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
