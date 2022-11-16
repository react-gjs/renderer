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

  add(child: GridItemElement) {
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

    this.items.push(childEntry);

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
