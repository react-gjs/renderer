import { DataType } from "dilswer";
import Gtk from "gi://Gtk";
import { diffProps } from "../../reconciler/diff-props";
import { FlowBoxElement } from "../flow-box/flow-box";
import type { GjsElement } from "../gjs-element";
import { GjsElementManager } from "../gjs-element-manager";
import type { TextNode } from "../markup/text-node";
import { ChildOrderController } from "../utils/element-extenders/child-order-controller";
import { ElementLifecycleController } from "../utils/element-extenders/element-lifecycle-controller";
import type { SyntheticEvent } from "../utils/element-extenders/event-handlers";
import type { DiffedProps } from "../utils/element-extenders/map-properties";
import { PropertyMapper } from "../utils/element-extenders/map-properties";
import { SyntheticEmitter } from "../utils/element-extenders/synthetic-emitter";
import { ensureNotString } from "../utils/ensure-not-string";
import type { AlignmentProps } from "../utils/property-maps-factories/create-alignment-prop-mapper";
import { createAlignmentPropMapper } from "../utils/property-maps-factories/create-alignment-prop-mapper";
import type { MarginProps } from "../utils/property-maps-factories/create-margin-prop-mapper";
import { createMarginPropMapper } from "../utils/property-maps-factories/create-margin-prop-mapper";

type FlowBoxEntryPropsMixin = AlignmentProps & MarginProps;

export interface FlowBoxEntryProps extends FlowBoxEntryPropsMixin {
  onSelect?: (event: SyntheticEvent<{ isSelected: boolean }>) => void;
}

export class FlowBoxEntryElement
  implements GjsElement<"FLOW_BOX_ENTRY", Gtk.FlowBoxChild>
{
  readonly kind = "FLOW_BOX_ENTRY";
  widget = new Gtk.FlowBoxChild();

  private parent: FlowBoxElement | null = null;

  private readonly lifecycle = new ElementLifecycleController();
  private children = new ChildOrderController(this.lifecycle, this.widget);

  emitter = new SyntheticEmitter<{ selected: [boolean] }>(this.lifecycle);

  private readonly propMapper = new PropertyMapper<FlowBoxEntryProps>(
    this.lifecycle,
    createAlignmentPropMapper(this.widget),
    createMarginPropMapper(this.widget),
    (props) =>
      props.onSelect(DataType.Function, (callback) => {
        if (callback) {
          const listener = this.emitter.on("selected", (isSelected) =>
            callback({
              isSelected,
              target: this.widget,
              stopPropagation: () => {}, // no-op
            })
          );
          return () => listener.remove();
        }
      })
  );

  constructor(props: any) {
    this.updateProps(props);

    this.lifecycle.emitLifecycleEventAfterCreate();
  }

  updateProps(props: DiffedProps): void {
    this.lifecycle.emitLifecycleEventUpdate(props);
  }

  // #region This widget direct mutations

  appendChild(child: GjsElement | TextNode): void {
    ensureNotString(child);

    child.notifyWillAppendTo(this);
    this.children.addChild(child);
    this.widget.show_all();
  }

  insertBefore(newChild: GjsElement | TextNode, beforeChild: GjsElement): void {
    ensureNotString(newChild);

    newChild.notifyWillAppendTo(this);
    this.children.insertBefore(newChild, beforeChild);
    this.widget.show_all();
  }

  remove(parent: GjsElement): void {
    parent.notifyWillUnmount(this);

    this.lifecycle.emitLifecycleEventBeforeDestroy();

    this.widget.destroy();
  }

  render() {
    this.parent?.widget.show_all();
  }

  // #endregion

  // #region Element internal signals

  notifyWillAppendTo(parent: GjsElement): void {
    if (!GjsElementManager.isGjsElementOfKind(parent, FlowBoxElement)) {
      throw new Error(
        "FlowBoxEntry can only be appended to a FlowBox container."
      );
    }
  }

  notifyWillUnmount(child: GjsElement): void {
    this.children.removeChild(child);
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
