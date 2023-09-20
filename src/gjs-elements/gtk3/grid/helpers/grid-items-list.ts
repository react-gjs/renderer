import type { ElementLifecycle } from "../../../element-extender";
import type { GjsElement } from "../../../gjs-element";
import { Dispatcher } from "../../../utils/dispatcher";
import type { GridItemElement } from "../grid-item";

export type ChildrenInfo = {
  element: GridItemElement;
  shouldOmit: boolean;
  columnSpan: number;
  rowSpan: number;
};

type ItemEntry = {
  id: symbol;
  element: GridItemElement;
  shouldOmit: boolean;
  columnSpan: number;
  rowSpan: number;
  listeners: Array<{ remove: () => void }>;
  dispatcher: Dispatcher;
};

export class GridItemsList {
  protected items: Array<ItemEntry> = [];

  constructor(
    protected lifecycle: ElementLifecycle,
    protected onChildChangeInterface: {
      onChildChange(params: ChildrenInfo): void;
      onChildAdded(params: ChildrenInfo): void;
      onChildRemoved(params: GridItemElement): void;
    },
  ) {
    lifecycle.onBeforeDestroy(() => this.cleanup());
  }

  count(): number {
    return this.items.length;
  }

  get(index: number): ChildrenInfo {
    return this.items[index];
  }

  getAll(): ChildrenInfo[] {
    return [...this.items];
  }

  getIndexOf(child: GjsElement) {
    return this.items.findIndex(
      (item) => item.element === (child as any),
    );
  }

  add(
    child: GridItemElement,
    shouldOmitMount: boolean,
    atIndex?: number,
  ) {
    const id = Symbol();

    const { colSpan, rowSpan } = child.getSpans();

    const childEntry: ItemEntry = {
      id,
      element: child,
      shouldOmit: shouldOmitMount,
      columnSpan: colSpan,
      rowSpan: rowSpan,
      listeners: [],
      dispatcher: new Dispatcher(5),
    };

    if (atIndex === undefined) {
      this.items.push(childEntry);
    } else {
      this.items.splice(atIndex, 0, childEntry);
    }

    // Subscribe to the child prop changes
    childEntry.listeners.push(
      child.emitter.on("columnSpanChanged", (newColSpan) => {
        childEntry.columnSpan = newColSpan;
        childEntry.dispatcher.dispatch(() =>
          this.onChildChangeInterface.onChildChange(childEntry),
        );
      }),
      child.emitter.on("rowSpanChanged", (newRowSpan) => {
        childEntry.rowSpan = newRowSpan;
        childEntry.dispatcher.dispatch(() =>
          this.onChildChangeInterface.onChildChange(childEntry),
        );
      }),
      child.emitter.on("itemUpdated", () => {
        childEntry.dispatcher.dispatch(() =>
          this.onChildChangeInterface.onChildChange(childEntry),
        );
      }),
      child.emitter.on("itemDestroyed", () => {
        this.items = this.items.filter((item) => item.id !== id);
        childEntry.dispatcher.cancelPreviousDispatch();
        childEntry.listeners.forEach((listener) => listener.remove());
        this.onChildChangeInterface.onChildRemoved(child);
      }),
    );

    this.onChildChangeInterface.onChildAdded(childEntry);
  }

  protected cleanup() {
    this.items.forEach((item) => {
      item.listeners.forEach((listener) => listener.remove());
      item.dispatcher.cancelPreviousDispatch();
    });
    this.items = [];
  }
}
