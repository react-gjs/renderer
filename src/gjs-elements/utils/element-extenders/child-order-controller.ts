import type Gtk from "gi://Gtk";
import type { ElementLifecycle } from "../../element-extender";
import type { GjsElement } from "../../gjs-element";

export class ChildOrderController<C extends GjsElement = GjsElement> {
  private children: C[] = [];

  constructor(
    private element: ElementLifecycle,
    private container: Gtk.Container,
    customAddMethod?: (child: C) => void
  ) {
    if (customAddMethod)
      this.addChild = (child: C) => {
        customAddMethod(child);
        this.children.push(child);
      };
  }

  count() {
    return this.children.length;
  }

  addChild = (child: C) => {
    this.container.add(child.widget);
    this.children.push(child);
  };

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
      this.container.remove(childrenAfter[i].widget);
    }

    this.container.add(newChild.widget);

    for (let i = 0; i < childrenAfter.length; i++) {
      this.container.add(childrenAfter[i].widget);
    }

    this.children.splice(beforeIndex, 0, newChild);
  }
}
