import { DataType } from "dilswer";
import type Gtk from "gi://Gtk";
import type React from "react";
import { diffProps } from "../../reconciler/diff-props";
import type { GjsElement } from "../gjs-element";
import { GjsElementManager } from "../gjs-element-manager";
import { ensureNotString } from "../utils/ensure-not-string";
import type { DiffedProps } from "../utils/map-properties";
import { createPropMap } from "../utils/map-properties";
import { SyntheticEmitter } from "../utils/synthetic-emitter";
import { GridElement } from "./grid";

export interface GridItemProps {
  columnSpan?: number;
  rowSpan?: number;
  children: React.ReactElement;
}

export type GridItemEvents = {
  columnSpanChanged: [number];
  rowSpanChanged: [number];
  itemDestroyed: [GridItemElement];
};

export class GridItemElement implements GjsElement<"GRID_ITEM"> {
  readonly kind = "GRID_ITEM";

  private parent: GjsElement | null = null;
  private childElement: GjsElement | null = null;

  emitter = new SyntheticEmitter<GridItemEvents>();

  private readonly propsMapper = createPropMap<GridItemProps>((props) =>
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

  get widget(): Gtk.Widget {
    if (!this.childElement) {
      throw new Error("GridItem must have a child.");
    }
    return this.childElement.widget;
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
    ensureNotString(child);

    if (this.childElement != null) {
      throw new Error("GridItem can only have one child.");
    } else {
      child.notifyWillAppendTo(this);
      this.childElement = child;
    }
  }

  notifyWillUnmount() {
    this.childElement = null;
  }

  remove(parent: GjsElement): void {
    parent.notifyWillUnmount(this);

    this.emitter.emit("itemDestroyed", this);

    this.childElement = null;

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

  insertBefore(): void {
    throw new Error("GridItem can only have one child.");
  }

  diffProps(
    oldProps: Record<string, any>,
    newProps: Record<string, any>
  ): DiffedProps {
    return diffProps(oldProps, newProps, true);
  }
}
