import { DataType } from "dilswer";
import Gtk from "gi://Gtk";
import type React from "react";
import type { GjsContext } from "../../reconciler/gjs-renderer";
import type { HostContext } from "../../reconciler/host-context";
import type { GjsElement } from "../gjs-element";
import { GjsElementManager } from "../gjs-element-manager";
import type { TextNode } from "../markup/text-node";
import { diffProps } from "../utils/diff-props";
import { ElementLifecycleController } from "../utils/element-extenders/element-lifecycle-controller";
import type { DiffedProps } from "../utils/element-extenders/map-properties";
import { PropertyMapper } from "../utils/element-extenders/map-properties";
import { SyntheticEmitter } from "../utils/element-extenders/synthetic-emitter";
import { ensureNotString } from "../utils/ensure-not-string";
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
  static getContext(
    currentContext: HostContext<GjsContext>
  ): HostContext<GjsContext> {
    return currentContext;
  }

  readonly kind = "GRID_ITEM";
  private emptyReplacement = new Gtk.Box();
  private childElement: GjsElement | null = null;
  get widget(): Gtk.Widget {
    if (!this.childElement) {
      throw this.emptyReplacement;
    }
    return this.childElement.widget;
  }

  private parent: GridElement | null = null;

  private readonly lifecycle = new ElementLifecycleController();
  emitter = new SyntheticEmitter<GridItemEvents>(this.lifecycle);
  private readonly propsMapper = new PropertyMapper<GridItemProps>(
    this.lifecycle,
    (props) =>
      props
        .columnSpan(DataType.Number, (v = 1) => {
          this.emitter.emit("columnSpanChanged", v);
        })
        .rowSpan(DataType.Number, (v = 1) => {
          this.emitter.emit("rowSpanChanged", v);
        })
  );

  constructor(props: DiffedProps) {
    this.updateProps(props);

    this.lifecycle.emitLifecycleEventAfterCreate();
  }

  getSpans() {
    const colSpan = this.propsMapper.currentProps.columnSpan ?? 1;
    const rowSpan = this.propsMapper.currentProps.rowSpan ?? 1;

    return { colSpan, rowSpan };
  }

  updateProps(props: DiffedProps): void {
    this.lifecycle.emitLifecycleEventUpdate(props);
  }

  // #region This widget direct mutations

  appendChild(child: GjsElement | TextNode): void {
    ensureNotString(child);

    if (this.childElement != null) {
      throw new Error("GridItem can only have one child.");
    } else {
      child.notifyWillAppendTo(this);
      this.childElement = child;
      this.parent?.onChildAdded();
    }
  }

  insertBefore(): void {
    throw new Error("GridItem can only have one child.");
  }

  remove(parent: GjsElement): void {
    parent.notifyWillUnmount(this);

    this.lifecycle.emitLifecycleEventBeforeDestroy();
    this.emitter.emit("itemDestroyed", this);
    this.childElement = null;

    this.widget.destroy();
  }

  render() {
    this.parent?.widget.show_all();
  }

  // #endregion

  // #region Element internal signals

  notifyWillAppendTo(parent: GjsElement): void {
    if (!GjsElementManager.isGjsElementOfKind(parent, GridElement)) {
      throw new Error("GridItem can only be appended to the Grid container.");
    }
    this.parent = parent;
  }

  notifyWillUnmount() {
    this.childElement = null;
    this.parent?.onChildChange();
  }

  // #endregion

  // #region Utils for external use

  diffProps(
    oldProps: Record<string, any>,
    newProps: Record<string, any>
  ): DiffedProps {
    return diffProps(oldProps, newProps, true);
  }

  // #endregion
}
