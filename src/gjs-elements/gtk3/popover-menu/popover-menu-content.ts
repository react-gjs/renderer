import { DataType } from "dilswer";
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
import type { TextNode } from "../markup/text-node";
import { PopoverMenuEntryElement } from "./content-elements/popover-menu-entry";
import { PopoverMenuElement } from "./popover-menu";

export interface PopoverMenuContentProps {
  minWidth?: number;
}

export class PopoverMenuContentElement
  implements GjsElement<"POPOVER_MENU_CONTENT", Gtk.ScrolledWindow>
{
  static getContext(
    currentContext: HostContext<GjsContext>
  ): HostContext<GjsContext> {
    return currentContext;
  }

  static createWidget(scrollBox: Gtk.ScrolledWindow, box: Gtk.Box) {
    scrollBox.margin = 10;
    scrollBox.propagate_natural_width = true;
    scrollBox.propagate_natural_height = true;
    box.orientation = Gtk.Orientation.VERTICAL;
    scrollBox.add(box);
    return scrollBox;
  }

  scrollBox = new Gtk.ScrolledWindow();
  box = new Gtk.Box();

  readonly kind = "POPOVER_MENU_CONTENT";
  widget = PopoverMenuContentElement.createWidget(this.scrollBox, this.box);

  parentMenu: string | null = null;
  rootMenu: PopoverMenuElement | null = null;

  private parent: PopoverMenuElement | null = null;

  readonly lifecycle = new ElementLifecycleController();
  private readonly children = new ChildOrderController<PopoverMenuEntryElement>(
    this.lifecycle,
    this.box
  );
  private readonly propsMapper = new PropertyMapper<PopoverMenuContentProps>(
    this.lifecycle,
    (props) =>
      props.minWidth(DataType.Number, (v = -1) => {
        this.scrollBox.min_content_width = v;
      })
  );

  constructor(props: DiffedProps) {
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

    if (!GjsElementManager.isGjsElementOfKind(child, PopoverMenuEntryElement)) {
      throw new Error("Popover can only have PopoverEntry as children");
    }

    const shouldAppend = child.notifyWillAppendTo(this);

    if (this.parentMenu) {
      child.setParentMenu(this.parentMenu);
    }

    if (this.rootMenu) {
      child.setRootMenu(this.rootMenu);
    }

    this.children.addChild(child, !shouldAppend);
    this.widget.show_all();
  }

  insertBefore(newChild: GjsElement | TextNode, beforeChild: GjsElement): void {
    ensureNotText(newChild);

    if (
      !GjsElementManager.isGjsElementOfKind(newChild, PopoverMenuEntryElement)
    ) {
      throw new Error("Popover can only have PopoverEntry as children");
    }

    const shouldAppend = newChild.notifyWillAppendTo(this);

    if (this.parentMenu) {
      newChild.setParentMenu(this.parentMenu);
    }

    if (this.rootMenu) {
      newChild.setRootMenu(this.rootMenu);
    }

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
    if (!GjsElementManager.isGjsElementOfKind(parent, PopoverMenuElement)) {
      throw new Error(
        "PopoverContentElement can only be a child of PopoverElement"
      );
    }
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
