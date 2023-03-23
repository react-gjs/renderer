import type Gtk from "gi://Gtk";
import type { ElementLifecycle } from "../../element-extender";
import type { GjsElement } from "../../gjs-element";

class ChildEntry<C extends GjsElement> {
  constructor(public element: C, public isNonAttachable: boolean) {}
}

export class ChildOrderController<C extends GjsElement = GjsElement> {
  private children: ChildEntry<C>[] = [];

  constructor(
    private element: ElementLifecycle,
    private container: Gtk.Container,
    private addChildToContainer: (
      child: ReturnType<C["getWidget"]>,
      element: C,
      index: number
    ) => void = (child: ReturnType<C["getWidget"]>) => {
      this.container.add(child);
    },
    private removeChildFromContainer: (
      child: ReturnType<C["getWidget"]>,
      element: C
    ) => void = (child: ReturnType<C["getWidget"]>) => {
      this.container.remove(child);
    }
  ) {}

  forEach(callback: (child: C) => void) {
    this.children.forEach((c) => callback(c.element));
  }

  /**
   * Returns the number of children in the container, including top
   * level elements that are not directly added to the container.
   */
  count() {
    return this.children.length;
  }

  /**
   * Adds the child to the container, unless it's a top level element.
   * (even if the child is top level this method should be called on
   * it regardless, otherwise there's a chance for `insertBefore`
   * method to fail in the future)
   */
  addChild(child: C, isNonAttachable = false) {
    if (!isNonAttachable) {
      this.addChildToContainer(
        child.getWidget() as ReturnType<C["getWidget"]>,
        child,
        this.children.length
      );
    }
    this.children.push(new ChildEntry(child, isNonAttachable));
  }

  /**
   * Removes the child from the tracked children list. This does not
   * detach or destroy the child. Children are responsible for
   * destroying themselves when the reconciler requests so.
   */
  removeChild(child: GjsElement) {
    this.children = this.children.filter((c) => c.element !== child);
  }

  /**
   * Inserts the new child before the `beforeChild` element, unless
   * the new child is a top level element. (even if the child is top
   * level this method should be called on it regardless, otherwise
   * there's a chance for `insertBefore` method to fail in the
   * future)
   */
  insertBefore(newChild: C, beforeChild: GjsElement, isNonAttachable = false) {
    const beforeIndex = this.children.findIndex(
      (c) => c.element === beforeChild
    );

    if (beforeIndex === -1) {
      throw new Error("beforeChild not found in the children list");
    }

    const childrenAfter = this.children.slice(beforeIndex);

    if (!isNonAttachable) {
      for (let i = 0; i < childrenAfter.length; i++) {
        if (!childrenAfter[i].isNonAttachable) {
          this.removeChildFromContainer(
            childrenAfter[i].element.getWidget() as ReturnType<C["getWidget"]>,
            childrenAfter[i].element
          );
        }
      }

      this.addChildToContainer(
        newChild.getWidget() as ReturnType<C["getWidget"]>,
        newChild,
        beforeIndex
      );

      for (let i = 0; i < childrenAfter.length; i++) {
        if (!childrenAfter[i].isNonAttachable) {
          this.addChildToContainer(
            childrenAfter[i].element.getWidget() as ReturnType<C["getWidget"]>,
            childrenAfter[i].element,
            beforeIndex + i + 1
          );
        }
      }
    }

    this.children.splice(
      beforeIndex,
      0,
      new ChildEntry(newChild, isNonAttachable)
    );
  }

  reattachWidget(child: C) {
    const childIndex = this.children.findIndex((c) => c.element === child);

    const entry = this.children[childIndex];

    if (childIndex === -1) {
      return;
    }

    if (entry.isNonAttachable) {
      return;
    }

    const childrenAfter = this.children.slice(childIndex);

    for (let i = 0; i < childrenAfter.length; i++) {
      if (!childrenAfter[i].isNonAttachable) {
        this.removeChildFromContainer(
          childrenAfter[i].element.getWidget() as ReturnType<C["getWidget"]>,
          childrenAfter[i].element
        );
      }
    }

    for (let i = 0; i < childrenAfter.length; i++) {
      if (!childrenAfter[i].isNonAttachable) {
        this.addChildToContainer(
          childrenAfter[i].element.getWidget() as ReturnType<C["getWidget"]>,
          childrenAfter[i].element,
          childIndex + i + 1
        );
      }
    }

    this.children.splice(
      childIndex,
      0,
      new ChildEntry(child, entry.isNonAttachable)
    );
  }
}
