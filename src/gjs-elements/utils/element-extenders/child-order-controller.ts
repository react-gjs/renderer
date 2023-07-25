import type Gtk from "gi://Gtk";
import type { ElementLifecycle } from "../../element-extender";
import type { GjsElement } from "../../gjs-element";

class ChildEntry<C extends GjsElement> {
  constructor(
    public element: C,
    public shouldOmitMount: boolean,
  ) {}
}

export class ChildOrderController<C extends GjsElement = GjsElement> {
  private children: ChildEntry<C>[] = [];

  constructor(
    private element: ElementLifecycle,
    private container: Gtk.Container,
    private addChildToContainer: (
      child: ReturnType<C["getWidget"]>,
      element: C,
      index: number,
    ) => void = (child: ReturnType<C["getWidget"]>) => {
      this.container.add(child);
    },
    private removeChildFromContainer: (
      child: ReturnType<C["getWidget"]>,
      element: C,
    ) => void = (child: ReturnType<C["getWidget"]>) => {
      this.container.remove(child);
    },
  ) {}

  forEach(callback: (child: C) => void) {
    for (let i = 0; i < this.children.length; i++) {
      callback(this.children[i].element);
    }
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
  addChild(child: C, shouldOmitMount = false) {
    this.removeChild(child);

    if (!shouldOmitMount) {
      this.addChildToContainer(
        child.getWidget() as ReturnType<C["getWidget"]>,
        child,
        this.children.length,
      );
    }
    this.children.push(new ChildEntry(child, shouldOmitMount));
  }

  /**
   * Removes the child from the tracked children list. This does not
   * detach or destroy the child. Children are responsible for
   * destroying themselves when the reconciler requests so.
   */
  removeChild(child: GjsElement) {
    const idx = this.children.findIndex((c) => c.element === child);
    if (idx !== -1) {
      this.children.splice(idx, 1);
    }
  }

  /**
   * Inserts the new child before the `beforeChild` element, unless
   * the new child is a top level element. (even if the child is top
   * level this method should be called on it regardless, otherwise
   * there's a chance for `insertBefore` method to fail in the
   * future)
   */
  insertBefore(
    newChild: C,
    beforeChild: GjsElement,
    shouldOmitMount = false,
  ) {
    this.removeChild(newChild);

    const beforeIndex = this.children.findIndex(
      (c) => c.element === beforeChild,
    );

    if (beforeIndex === -1) {
      throw new Error("beforeChild not found in the children list");
    }

    const childrenAfter = this.children.slice(beforeIndex);

    if (!shouldOmitMount) {
      for (let i = 0; i < childrenAfter.length; i++) {
        if (!childrenAfter[i].shouldOmitMount) {
          childrenAfter[i].element.notifyWillUnmount();
          this.removeChildFromContainer(
            childrenAfter[i].element.getWidget() as ReturnType<
              C["getWidget"]
            >,
            childrenAfter[i].element,
          );
        }
      }

      this.addChildToContainer(
        newChild.getWidget() as ReturnType<C["getWidget"]>,
        newChild,
        beforeIndex,
      );

      for (let i = 0; i < childrenAfter.length; i++) {
        if (!childrenAfter[i].shouldOmitMount) {
          this.addChildToContainer(
            childrenAfter[i].element.getWidget() as ReturnType<
              C["getWidget"]
            >,
            childrenAfter[i].element,
            beforeIndex + i + 1,
          );
          childrenAfter[i].element.notifyMounted();
        }
      }
    }

    this.children.splice(
      beforeIndex,
      0,
      new ChildEntry(newChild, shouldOmitMount),
    );
  }

  reattachWidget(child: C) {
    const childIndex = this.children.findIndex(
      (c) => c.element === child,
    );

    const entry = this.children[childIndex];

    if (childIndex === -1) {
      return;
    }

    if (entry.shouldOmitMount) {
      return;
    }

    const childrenAfter = this.children.slice(childIndex);

    for (let i = 0; i < childrenAfter.length; i++) {
      if (!childrenAfter[i].shouldOmitMount) {
        this.removeChildFromContainer(
          childrenAfter[i].element.getWidget() as ReturnType<
            C["getWidget"]
          >,
          childrenAfter[i].element,
        );
      }
    }

    for (let i = 0; i < childrenAfter.length; i++) {
      if (!childrenAfter[i].shouldOmitMount) {
        this.addChildToContainer(
          childrenAfter[i].element.getWidget() as ReturnType<
            C["getWidget"]
          >,
          childrenAfter[i].element,
          childIndex + i + 1,
        );
      }
    }

    this.children.splice(
      childIndex,
      0,
      new ChildEntry(child, entry.shouldOmitMount),
    );
  }
}
