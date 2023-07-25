import { DataType } from "dilswer";
import Gtk from "gi://Gtk";
import type { GjsContext } from "../../../reconciler/gjs-renderer";
import type { HostContext } from "../../../reconciler/host-context";
import { BaseElement, type GjsElement } from "../../gjs-element";
import { GjsElementManager } from "../../gjs-element-manager";
import { ElementLifecycleController } from "../../utils/element-extenders/element-lifecycle-controller";
import type { DiffedProps } from "../../utils/element-extenders/map-properties";
import { PropertyMapper } from "../../utils/element-extenders/map-properties";
import { SyntheticEmitter } from "../../utils/element-extenders/synthetic-emitter";
import { ensureNotText } from "../../utils/ensure-not-string";
import { mountAction } from "../../utils/mount-action";
import { createChildPropsMapper } from "../../utils/property-maps-factories/create-child-props-mapper";
import type { TextNode } from "../text-node";
import { GridElement } from "./grid";

export interface GridItemProps {
  columnSpan?: number;
  rowSpan?: number;
}

export type GridItemEvents = {
  columnSpanChanged: [number];
  rowSpanChanged: [number];
  itemDestroyed: [GridItemElement];
  itemUpdated: [GridItemElement];
};

export class GridItemElement
  extends BaseElement
  implements GjsElement<"GRID_ITEM">
{
  static getContext(
    currentContext: HostContext<GjsContext>,
  ): HostContext<GjsContext> {
    return currentContext;
  }

  readonly kind = "GRID_ITEM";
  protected emptyReplacement = new Gtk.Box();
  protected childElement: GjsElement | null = null;
  protected get widget(): Gtk.Widget {
    if (!this.childElement) {
      throw this.emptyReplacement;
    }
    return this.childElement.getWidget();
  }

  protected parent: GridElement | null = null;

  protected readonly lifecycle = new ElementLifecycleController();
  protected handlers = null;
  emitter = new SyntheticEmitter<GridItemEvents>(this.lifecycle);
  protected readonly propsMapper = new PropertyMapper<GridItemProps>(
    this.lifecycle,
    createChildPropsMapper(
      () => this.widget,
      () => this.parent,
    ),
    (props) =>
      props
        .columnSpan(DataType.Number, (v = 1) => {
          this.emitter.emit("columnSpanChanged", v);
        })
        .rowSpan(DataType.Number, (v = 1) => {
          this.emitter.emit("rowSpanChanged", v);
        }),
  );

  constructor(props: DiffedProps) {
    super();
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
    ensureNotText(child);

    if (this.childElement != null) {
      throw new Error("GridItem can only have one child.");
    } else {
      const shouldAppend = child.notifyWillMountTo(this);
      if (shouldAppend) {
        child.notifyMounted();
      }

      mountAction(
        this,
        child,
        (shouldOmitMount) => {
          if (!shouldOmitMount) {
            this.childElement = child;
            this.emitter.emit("itemUpdated", this);
          }
        },
        () => {
          this.widget.show_all();
        },
      );
    }
  }

  insertBefore(): void {
    throw new Error("GridItem can only have one child.");
  }

  remove(parent: GjsElement): void {
    parent.notifyChildWillUnmount(this);

    this.lifecycle.emitLifecycleEventBeforeDestroy();
    this.childElement = null;
    this.emitter.emit("itemDestroyed", this);

    this.widget.destroy();
  }

  render() {
    this.widget.show_all();
  }

  // #endregion

  // #region Element internal signals

  notifyWillMountTo(parent: GjsElement): boolean {
    if (!GjsElementManager.isGjsElementOfKind(parent, GridElement)) {
      throw new Error(
        "GridItem can only be appended to the Grid container.",
      );
    }
    this.parent = parent;
    return true;
  }

  notifyMounted(): void {
    this.lifecycle.emitMountedEvent();
  }

  notifyChildWillUnmount() {
    this.childElement = null;
    this.emitter.emit("itemUpdated", this);
  }

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
    callback: Rg.GjsElementEventListenerCallback,
  ): void {}

  removeEventListener(
    signal: string,
    callback: Rg.GjsElementEventListenerCallback,
  ): void {}

  // #endregion
}
