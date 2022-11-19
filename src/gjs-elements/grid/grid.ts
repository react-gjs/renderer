import { DataType } from "dilswer";
import Gtk from "gi://Gtk";
import { diffProps } from "../../reconciler/diff-props";
import type { GjsElement } from "../gjs-element";
import { GjsElementManager } from "../gjs-element-manager";
import { ensureNotString } from "../utils/ensure-not-string";
import type { DiffedProps } from "../utils/map-properties";
import { createPropMap } from "../utils/map-properties";
import type { AlignmentProps } from "../utils/property-maps-factories/create-alignment-prop-mapper";
import { createAlignmentPropMapper } from "../utils/property-maps-factories/create-alignment-prop-mapper";
import type { MarginProps } from "../utils/property-maps-factories/create-margin-prop-mapper";
import { createMarginPropMapper } from "../utils/property-maps-factories/create-margin-prop-mapper";
import type { SyntheticEmitter } from "../utils/synthetic-emitter";
import { GridItemElement } from "./grid-item";
import { GridItemsList } from "./helpers/grid-items-list";
import { GridMatrix } from "./helpers/grid-matrix";

type GridPropsMixin = AlignmentProps & MarginProps;

export interface GridProps extends GridPropsMixin {
  columns: number;
  columnSpacing?: number;
  rowSpacing?: number;
  /**
   * Whether the grid rows should all have the same height.
   *
   * @default false
   */
  sameRowHeight?: boolean;
  /**
   * Whether the grid columns should all have the same width.
   *
   * @default true
   */
  sameColumnWidth?: boolean;
}

export class GridElement implements GjsElement<"GRID", Gtk.Grid> {
  readonly kind = "GRID";

  private parent: GjsElement | null = null;
  widget = new Gtk.Grid();

  private children = new GridItemsList(this);
  private columns = 1;

  /**
   * The column count that was used the last time the grid was
   * re-arranged.
   */
  private previousColumnCount = 0;

  private readonly propsMapper = createPropMap<GridProps>(
    createAlignmentPropMapper(this.widget),
    createMarginPropMapper(this.widget),
    (props) =>
      props
        .columns(DataType.Number, (V = 1) => {
          this.columns = V;
          this.rearrangeChildren();
        })
        .columnSpacing(DataType.Number, (V = 0) => {
          this.widget.set_column_spacing(V);
        })
        .rowSpacing(DataType.Number, (V = 0) => {
          this.widget.set_row_spacing(V);
        })
        .sameColumnWidth(DataType.Boolean, (V = true) => {
          this.widget.column_homogeneous = V;
        })
        .sameRowHeight(DataType.Boolean, (V = false) => {
          this.widget.row_homogeneous = V;
        })
  );

  constructor(props: any) {
    this.updateProps(props);
  }
  emitter?: SyntheticEmitter<any> | undefined;

  private rearrangeChildren() {
    for (let i = this.previousColumnCount - 1; i >= 0; i--) {
      this.widget.remove_column(i);
    }

    const gridMatrix = new GridMatrix(this.columns);

    for (const child of this.children.getAll()) {
      const { x, y } = gridMatrix.nextElement(child.columnSpan, child.rowSpan);

      this.widget.attach(
        child.element.widget,
        x,
        y,
        child.columnSpan,
        child.rowSpan
      );
    }

    this.previousColumnCount = this.columns;

    this.widget.show_all();
  }

  /**
   * Callback that is called by the `GridItemsList` when a child
   * spans change.
   *
   * @internal
   */
  onChildChange() {
    this.rearrangeChildren();
  }

  /**
   * Callback that is called by the `GridItemsList` when a child
   * is added to this container.
   *
   * @internal
   */
  onChildAdded() {
    this.rearrangeChildren();
  }

  /**
   * Callback that is called by the `GridItemsList` when a child
   * is removed from this container.
   *
   * @internal
   */
  onChildRemoved() {
    this.rearrangeChildren();
  }

  notifyWillAppendTo(parent: GjsElement): void {
    this.parent = parent;
  }

  appendChild(child: GjsElement | string): void {
    ensureNotString(child);

    if (GjsElementManager.isGjsElementOfKind(child, GridItemElement)) {
      child.notifyWillAppendTo(this);
      this.children.add(child);
    }
  }

  notifyWillUnmount() {}

  remove(parent: GjsElement): void {
    parent.notifyWillUnmount(this);

    this.children.cleanup();
    this.propsMapper.cleanupAll();
    this.widget.destroy();
  }

  updateProps(props: DiffedProps): void {
    this.propsMapper.update(props);
  }

  render() {
    this.parent?.widget.show_all();
  }

  insertBefore(newChild: string | GjsElement, beforeChild: GjsElement): void {
    ensureNotString(newChild);

    const position = this.children.getIndexOf(beforeChild);

    if (position === -1) {
      throw new Error("The beforeChild was not found.");
    }

    if (GjsElementManager.isGjsElementOfKind(newChild, GridItemElement)) {
      newChild.notifyWillAppendTo(this);
      this.children.add(newChild, position);
    }
  }

  diffProps(
    oldProps: Record<string, any>,
    newProps: Record<string, any>
  ): DiffedProps {
    return diffProps(oldProps, newProps, true);
  }
}
