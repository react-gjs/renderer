import { DataType } from "dilswer";
import Gtk from "gi://Gtk";
import type { GjsContext } from "../../../reconciler/gjs-renderer";
import type { HostContext } from "../../../reconciler/host-context";
import { BaseElement, type GjsElement } from "../../gjs-element";
import { GjsElementManager } from "../../gjs-element-manager";
import { ChildOrderController } from "../../utils/element-extenders/child-order-controller";
import { ElementLifecycleController } from "../../utils/element-extenders/element-lifecycle-controller";
import { EventHandlers } from "../../utils/element-extenders/event-handlers";
import type { DiffedProps } from "../../utils/element-extenders/map-properties";
import { PropertyMapper } from "../../utils/element-extenders/map-properties";
import { ensureNotText } from "../../utils/ensure-not-string";
import { mountAction } from "../../utils/mount-action";
import type { TextNode } from "../text-node";
import { PopoverMenuCheckButtonElement } from "./content-elements/popover-menu-check-button";
import { PopoverMenuEntryElement } from "./content-elements/popover-menu-entry";
import { PopoverMenuItemElement } from "./content-elements/popover-menu-item";
import { PopoverMenuRadioButtonElement } from "./content-elements/popover-menu-radio-button";
import { PopoverMenuSeparatorElement } from "./content-elements/popover-menu-separator";
import { PopoverMenuElement } from "./popover-menu";
import { POPOVER_MENU_MARGIN } from "./utils/popover-menu-model-button";

export interface PopoverMenuContentProps {
  minWidth?: number;
}

export class PopoverMenuContentElement
  extends BaseElement
  implements GjsElement<"POPOVER_MENU_CONTENT", Gtk.ScrolledWindow>
{
  static getContext(
    currentContext: HostContext<GjsContext>,
  ): HostContext<GjsContext> {
    return currentContext;
  }

  static createWidget(scrollBox: Gtk.ScrolledWindow, box: Gtk.Box) {
    scrollBox.margin = POPOVER_MENU_MARGIN;
    scrollBox.propagate_natural_width = true;
    scrollBox.propagate_natural_height = true;
    box.orientation = Gtk.Orientation.VERTICAL;
    scrollBox.add(box);
    return scrollBox;
  }

  protected scrollBox = new Gtk.ScrolledWindow();
  protected box = new Gtk.Box();

  readonly kind = "POPOVER_MENU_CONTENT";
  protected widget = PopoverMenuContentElement.createWidget(
    this.scrollBox,
    this.box,
  );

  parentMenu: string | null = null;
  rootMenu: PopoverMenuElement | null = null;

  protected parent: PopoverMenuElement | null = null;

  readonly lifecycle = new ElementLifecycleController();
  protected readonly handlers = new EventHandlers<
    Gtk.ScrolledWindow,
    PopoverMenuContentProps
  >(this);
  protected readonly children = new ChildOrderController<
    | PopoverMenuItemElement
    | PopoverMenuEntryElement
    | PopoverMenuCheckButtonElement
    | PopoverMenuRadioButtonElement
    | PopoverMenuSeparatorElement
  >(this.lifecycle, this.box);
  protected readonly propsMapper =
    new PropertyMapper<PopoverMenuContentProps>(
      this.lifecycle,
      (props) =>
        props.minWidth(DataType.Number, (v = -1) => {
          this.scrollBox.min_content_width = v;
        }),
    );

  constructor(props: DiffedProps) {
    super();
    this.updateProps(props);

    this.lifecycle.emitLifecycleEventAfterCreate();
  }

  setParentMenu(name: string) {
    this.parentMenu = name;
    this.children.forEach((child) => {
      child.setParentMenu(name);
    });
  }

  setRootMenu(root: PopoverMenuElement) {
    this.rootMenu = root;
    this.children.forEach((child) => {
      child.setRootMenu(root);
    });
  }

  updateProps(props: DiffedProps): void {
    this.lifecycle.emitLifecycleEventUpdate(props);
  }

  // #region This widget direct mutations

  appendChild(child: GjsElement | TextNode): void {
    ensureNotText(child);

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
        "Popover can only have PopoverEntry as children",
      );
    }

    mountAction(
      this,
      child,
      (shouldOmitMount) => {
        if (this.parentMenu) {
          child.setParentMenu(this.parentMenu);
        }

        if (this.rootMenu) {
          child.setRootMenu(this.rootMenu);
        }

        this.children.addChild(child, shouldOmitMount);
      },
      () => {
        this.widget.show_all();
      },
    );
  }

  insertBefore(
    child: GjsElement | TextNode,
    beforeChild: GjsElement,
  ): void {
    ensureNotText(child);

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
        "Popover can only have PopoverEntry as children",
      );
    }

    mountAction(
      this,
      child,
      (shouldOmitMount) => {
        if (this.parentMenu) {
          child.setParentMenu(this.parentMenu);
        }

        if (this.rootMenu) {
          child.setRootMenu(this.rootMenu);
        }

        this.children.insertBefore(
          child,
          beforeChild,
          shouldOmitMount,
        );
      },
      () => {
        this.widget.show_all();
      },
    );
  }

  remove(parent: GjsElement): void {
    parent.notifyChildWillUnmount(this);

    this.lifecycle.emitLifecycleEventBeforeDestroy();

    this.widget.destroy();
  }

  render() {
    this.parent?.getWidget().show_all();
  }

  // #endregion

  // #region Element internal signals

  notifyWillMountTo(parent: GjsElement): boolean {
    if (
      !GjsElementManager.isGjsElementOfKind(
        parent,
        PopoverMenuElement,
      )
    ) {
      throw new Error(
        "PopoverContentElement can only be a child of PopoverElement",
      );
    }
    this.parent = parent;
    return true;
  }

  notifyMounted(): void {
    this.lifecycle.emitMountedEvent();
  }

  notifyChildWillUnmount(child: GjsElement): void {
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

  getWidget() {
    return this.widget;
  }

  getParentElement() {
    return this.parent;
  }

  // #endregion
}
