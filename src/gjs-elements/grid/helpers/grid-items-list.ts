import type { GjsElement } from "../../gjs-element";
import { Dispatcher } from "../../utils/dispatcher";
import type { GridItemElement } from "../grid-item";

export type ChildrenInfo = {
  element: GridItemElement;
  columnSpan: number;
  rowSpan: number;
};

type ItemEntry = {
  id: symbol;
  element: GridItemElement;
  columnSpan: number;
  rowSpan: number;
  listeners: Array<{ remove: () => void }>;
  dispatcher: Dispatcher;
};

export class GridItemsList {
  private items: Array<ItemEntry> = [];

  constructor(
    private onChildChangeInterface: {
      onChildChange(params: ChildrenInfo): void;
      onChildAdded(params: ChildrenInfo): void;
      onChildRemoved(params: GridItemElement): void;
    }
  ) {}

  getAll(): ChildrenInfo[] {
    return [...this.items];
  }

  getIndexOf(child: GjsElement) {
    return this.items.findIndex((item) => item.element === (child as any));
  }

  add(child: GridItemElement, atIndex?: number) {
    const id = Symbol();

    const { colSpan, rowSpan } = child.getSpans();

    const childEntry: ItemEntry = {
      id,
      element: child,
      columnSpan: colSpan,
      rowSpan: rowSpan,
      listeners: [],
      dispatcher: new Dispatcher(20),
    };

    if (atIndex === undefined) {
      this.items.push(childEntry);
    } else {
      this.items.splice(atIndex, 0, childEntry);
    }

    childEntry.listeners.push(
      child.emitter.on("columnSpanChanged", (newColSpan) => {
        childEntry.columnSpan = newColSpan;
        childEntry.dispatcher.dispatch(() =>
          this.onChildChangeInterface.onChildChange(childEntry)
        );
      }),
      child.emitter.on("rowSpanChanged", (newRowSpan) => {
        childEntry.rowSpan = newRowSpan;
        childEntry.dispatcher.dispatch(() =>
          this.onChildChangeInterface.onChildChange(childEntry)
        );
      }),
      child.emitter.on("itemDestroyed", () => {
        this.items = this.items.filter((item) => item.id !== id);
        childEntry.dispatcher.cancelPreviousDispatch();
        this.onChildChangeInterface.onChildRemoved(child);
      })
    );

    this.onChildChangeInterface.onChildAdded(childEntry);
  }

  cleanup() {
    this.items.forEach((item) => {
      item.listeners.forEach((listener) => listener.remove());
      item.dispatcher.cancelPreviousDispatch();
    });
    this.items = [];
  }
}
