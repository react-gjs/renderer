import { DataType } from "dilswer";
import Gtk from "gi://Gtk";
import type { GjsContext } from "../../../reconciler/gjs-renderer";
import type { HostContext } from "../../../reconciler/host-context";
import type { GjsElement } from "../../gjs-element";
import { GjsElementManager } from "../../gjs-element-manager";
import { diffProps } from "../../utils/diff-props";
import { ElementLifecycleController } from "../../utils/element-extenders/element-lifecycle-controller";
import { EventHandlers } from "../../utils/element-extenders/event-handlers";
import type { DiffedProps } from "../../utils/element-extenders/map-properties";
import { PropertyMapper } from "../../utils/element-extenders/map-properties";
import { ensureNotText } from "../../utils/ensure-not-string";
import type { AlignmentProps } from "../../utils/property-maps-factories/create-alignment-prop-mapper";
import { createAlignmentPropMapper } from "../../utils/property-maps-factories/create-alignment-prop-mapper";
import type { ExpandProps } from "../../utils/property-maps-factories/create-expand-prop-mapper";
import { createExpandPropMapper } from "../../utils/property-maps-factories/create-expand-prop-mapper";
import type { MarginProps } from "../../utils/property-maps-factories/create-margin-prop-mapper";
import { createMarginPropMapper } from "../../utils/property-maps-factories/create-margin-prop-mapper";
import type { SizeRequestProps } from "../../utils/property-maps-factories/create-size-request-prop-mapper";
import { createSizeRequestPropMapper } from "../../utils/property-maps-factories/create-size-request-prop-mapper";
import type { StyleProps } from "../../utils/property-maps-factories/create-style-prop-mapper";
import { createStylePropMapper } from "../../utils/property-maps-factories/create-style-prop-mapper";
import type { TextNode } from "../text-node";
import { GridItemElement } from "./grid-item";
import { GridItemsList } from "./helpers/grid-items-list";
import { GridMatrix } from "./helpers/grid-matrix";

type GridPropsMixin = SizeRequestProps &
  AlignmentProps &
  MarginProps &
  ExpandProps &
  StyleProps;

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
  static getContext(
    currentContext: HostContext<GjsContext>
  ): HostContext<GjsContext> {
    return currentContext;
  }

  readonly kind = "GRID";
  private widget = new Gtk.Grid();

  private parent: GjsElement | null = null;

  private columns = 1;

  /**
   * The column count that was used the last time the grid was
   * re-arranged.
   */
  private previousColumnCount = 0;

  readonly lifecycle = new ElementLifecycleController();
  private readonly handlers = new EventHandlers<Gtk.Grid, GridProps>(this);
  private readonly children = new GridItemsList(this.lifecycle, this);
  private readonly propsMapper = new PropertyMapper<GridProps>(
    this.lifecycle,
    createSizeRequestPropMapper(this.widget),
    createAlignmentPropMapper(this.widget),
    createMarginPropMapper(this.widget),
    createExpandPropMapper(this.widget),
    createStylePropMapper(this.widget),
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

  constructor(props: DiffedProps) {
    this.updateProps(props);

    this.lifecycle.emitLifecycleEventAfterCreate();
  }

  private rearrangeChildren() {
    for (let i = this.previousColumnCount - 1; i >= 0; i--) {
      this.widget.remove_column(i);
    }

    const gridMatrix = new GridMatrix(this.columns);

    for (const child of this.children.getAll()) {
      const { x, y } = gridMatrix.nextElement(child.columnSpan, child.rowSpan);

      this.widget.attach(
        child.element.getWidget(),
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
   * Callback that is called by the `GridItemsList` when a child spans
   * change.
   *
   * @internal
   */
  onChildChange() {
    this.rearrangeChildren();
  }

  /**
   * Callback that is called by the `GridItemsList` when a child is
   * added to this container.
   *
   * @internal
   */
  onChildAdded() {
    this.rearrangeChildren();
  }

  /**
   * Callback that is called by the `GridItemsList` when a child is
   * removed from this container.
   *
   * @internal
   */
  onChildRemoved() {
    this.rearrangeChildren();
  }

  updateProps(props: DiffedProps): void {
    this.lifecycle.emitLifecycleEventUpdate(props);
  }

  // #region This widget direct mutations

  appendChild(child: GjsElement | TextNode): void {
    ensureNotText(child);

    if (GjsElementManager.isGjsElementOfKind(child, GridItemElement)) {
      // TODO: handle the should append logic
      child.notifyWillAppendTo(this);
      this.children.add(child);
    }
  }

  insertBefore(newChild: TextNode | GjsElement, beforeChild: GjsElement): void {
    ensureNotText(newChild);

    const position = this.children.getIndexOf(beforeChild);

    if (position === -1) {
      throw new Error("The beforeChild was not found.");
    }

    if (GjsElementManager.isGjsElementOfKind(newChild, GridItemElement)) {
      // TODO: handle the should append logic
      newChild.notifyWillAppendTo(this);
      this.children.add(newChild, position);
    }
  }

  remove(parent: GjsElement): void {
    parent.notifyWillUnmount(this);

    this.lifecycle.emitLifecycleEventBeforeDestroy();

    this.widget.destroy();
  }

  render() {
    this.widget.show_all();
  }

  // #endregion

  // #region Element internal signals

  notifyWillAppendTo(parent: GjsElement): boolean {
    this.parent = parent;
    return true;
  }

  notifyWillUnmount() {}

  // #endregion

  // #region Utils for external use

  show() {
    this.widget.visible = true;
  }

  hide() {
    this.widget.visible = false;
  }

  getWidget() {
    return this.widget;
  }

  getParentElement() {
    return this.parent;
  }

  addEventListener(
    signal: string,
    callback: Rg.GjsElementEvenTListenerCallback
  ): void {
    return this.handlers.addListener(signal, callback);
  }

  removeEventListener(
    signal: string,
    callback: Rg.GjsElementEvenTListenerCallback
  ): void {
    return this.handlers.removeListener(signal, callback);
  }

  setProperty(key: string, value: any) {
    this.lifecycle.emitLifecycleEventUpdate([[key, value]]);
  }

  getProperty(key: string) {
    return this.propsMapper.get(key);
  }

  diffProps(
    oldProps: Record<string, any>,
    newProps: Record<string, any>
  ): DiffedProps {
    return diffProps(oldProps, newProps, true);
  }

  // #endregion
}
