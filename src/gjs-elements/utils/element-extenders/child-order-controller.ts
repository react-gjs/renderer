import type Gtk from "gi://Gtk";
import type { ElementLifecycle } from "../../element-extender";
import type { GjsElement } from "../../gjs-element";

export class ChildOrderController<C extends GjsElement = GjsElement> {
  private children: C[] = [];

  constructor(
    private element: ElementLifecycle,
    private container: Gtk.Container,
    private addChildToContainer: (child: Gtk.Widget, element: C) => void = (
      child: Gtk.Widget
    ) => {
      this.container.add(child);
    },
    private removeChildFromContainer: (
      child: Gtk.Widget,
      element: C
    ) => void = (child: Gtk.Widget) => {
      this.container.remove(child);
    }
  ) {}

  count() {
    return this.children.length;
  }

  addChild(child: C) {
    this.addChildToContainer(child.widget, child);
    this.children.push(child);
  }

  removeChild(child: C) {
    this.children = this.children.filter((c) => c !== child);
  }

  insertBefore(newChild: C, beforeChild: GjsElement) {
    const beforeIndex = this.children.findIndex((c) => c === beforeChild);

    if (beforeIndex === -1) {
      throw new Error("beforeChild not found in the children list");
    }

    const childrenAfter = this.children.slice(beforeIndex);

    for (let i = 0; i < childrenAfter.length; i++) {
      this.removeChildFromContainer(childrenAfter[i].widget, childrenAfter[i]);
    }

    this.addChildToContainer(newChild.widget, newChild);

    for (let i = 0; i < childrenAfter.length; i++) {
      this.addChildToContainer(childrenAfter[i].widget, childrenAfter[i]);
    }

    this.children.splice(beforeIndex, 0, newChild);
  }
}
