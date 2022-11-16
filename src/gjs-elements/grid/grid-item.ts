import { DataType } from "dilswer";
import Gtk from "gi://Gtk";
import type { GjsElement } from "../gjs-element";
import { GjsElementManager } from "../gjs-element-manager";
import type { DiffedProps } from "../utils/map-properties";
import { createPropMap } from "../utils/map-properties";
import type { MarginProps } from "../utils/property-maps-factories/create-margin-prop-mapper";
import { createMarginPropMapper } from "../utils/property-maps-factories/create-margin-prop-mapper";
import { SyntheticEmitter } from "../utils/synthetic-emitter";
import { GridElement } from "./grid";

type GridItemPropsMixin = MarginProps;

export interface GridItemProps extends GridItemPropsMixin {
  columnSpan?: number;
  rowSpan?: number;
}

export type GridItemEvents = {
  columnSpanChanged: [number];
  rowSpanChanged: [number];
  itemDestroyed: [GridItemElement];
};

export class GridItemElement implements GjsElement<"GRID_ITEM", Gtk.Box> {
  readonly kind = "GRID_ITEM";

  private parent: GjsElement | null = null;
  widget = new Gtk.Box();

  emitter = new SyntheticEmitter<GridItemEvents>();

  private readonly propsMapper = createPropMap<GridItemProps>(
    createMarginPropMapper(this.widget),
    (props) =>
      props
        .columnSpan(DataType.Number, (V = 1) => {
          this.emitter.emit("columnSpanChanged", V);
        })
        .rowSpan(DataType.Number, (V = 1) => {
          this.emitter.emit("rowSpanChanged", V);
        })
  );

  constructor(props: any) {
    this.updateProps(props);
  }

  getSpans() {
    const colSpan = this.propsMapper.currentProps.columnSpan ?? 1;
    const rowSpan = this.propsMapper.currentProps.rowSpan ?? 1;

    return { colSpan, rowSpan };
  }

  notifyWillAppendTo(parent: GjsElement): void {
    if (!GjsElementManager.isGjsElementOfKind(parent, GridElement)) {
      throw new Error("GridItem can only be appended to the Grid container.");
    }
    this.parent = parent;
  }

  appendChild(child: GjsElement | string): void {
    if (typeof child === "string") {
      throw new Error("Box can only have other elements as it's children.");
    } else {
      child.notifyWillAppendTo(this);
      this.widget.add(child.widget);
      this.widget.show_all();
    }
  }

  remove(parent: GjsElement): void {
    this.emitter.emit("itemDestroyed", this);

    this.emitter.clear();
    this.propsMapper.cleanupAll();
    this.widget.destroy();
  }

  updateProps(props: DiffedProps): void {
    this.propsMapper.update(props);
  }

  render() {
    this.parent?.widget.show_all();
  }
}
