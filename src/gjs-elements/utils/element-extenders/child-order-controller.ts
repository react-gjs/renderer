import type Gtk from "gi://Gtk";
import type { ElementLifecycle } from "../../element-extender";
import type { GjsElement } from "../../gjs-element";

export class ChildOrderController {
  private children: GjsElement[] = [];

  constructor(
    private element: ElementLifecycle,
    private container: Gtk.Container,
    customAddMethod?: (child: GjsElement) => void
  ) {
    if (customAddMethod) this.addChild = customAddMethod;
  }

  count() {
    return this.children.length;
  }

  addChild = (child: GjsElement) => {
    this.container.add(child.widget);
    this.children.push(child);
  };

  removeChild(child: GjsElement) {
    this.children = this.children.filter((c) => c !== child);
  }

  insertBefore(newChild: GjsElement, beforeChild: GjsElement) {
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
