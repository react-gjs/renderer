import type Gtk from "gi://Gtk";
import type { ElementLifecycle } from "../../element-extender";
import type { GjsElement } from "../../gjs-element";

export class ChildOrderController<C extends GjsElement = GjsElement> {
  private children: C[] = [];

  constructor(
    private element: ElementLifecycle,
    private container: Gtk.Container,
    private addChildToContainer: (
      child: C["widget"],
      element: C,
      index: number
    ) => void = (child: C["widget"]) => {
      this.container.add(child);
    },
    private removeChildFromContainer: (
      child: C["widget"],
      element: C
    ) => void = (child: C["widget"]) => {
      this.container.remove(child);
    }
  ) {}

  count() {
    return this.children.length;
  }

  addChild(child: C) {
    this.addChildToContainer(child.widget, child, this.children.length);
    this.children.push(child);
  }

  removeChild(child: GjsElement) {
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

    this.addChildToContainer(newChild.widget, newChild, beforeIndex);

    for (let i = 0; i < childrenAfter.length; i++) {
      this.addChildToContainer(
        childrenAfter[i].widget,
        childrenAfter[i],
        beforeIndex + i + 1
      );
    }

    this.children.splice(beforeIndex, 0, newChild);
  }
}
