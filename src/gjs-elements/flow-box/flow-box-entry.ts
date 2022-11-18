import { DataType } from "dilswer";
import Gtk from "gi://Gtk";
import { FlowBoxElement } from "../flow-box/flow-box";
import type { GjsElement } from "../gjs-element";
import { GjsElementManager } from "../gjs-element-manager";
import { ensureNotString } from "../utils/ensure-not-string";
import type { SyntheticEvent } from "../utils/event-handlers";
import type { DiffedProps } from "../utils/map-properties";
import { createPropMap } from "../utils/map-properties";
import type { AlignmentProps } from "../utils/property-maps-factories/create-alignment-prop-mapper";
import { createAlignmentPropMapper } from "../utils/property-maps-factories/create-alignment-prop-mapper";
import type { MarginProps } from "../utils/property-maps-factories/create-margin-prop-mapper";
import { createMarginPropMapper } from "../utils/property-maps-factories/create-margin-prop-mapper";
import { SyntheticEmitter } from "../utils/synthetic-emitter";
import { ChildOrderController } from "../utils/widget-operations/child-order-controller";

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
  private children = new ChildOrderController(Gtk.FlowBox, this.widget);

  emitter = new SyntheticEmitter<{ selected: [boolean] }>();

  private readonly propMapper = createPropMap<FlowBoxEntryProps>(
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
  }

  notifyWillAppendTo(parent: GjsElement): void {
    if (!GjsElementManager.isGjsElementOfKind(parent, FlowBoxElement)) {
      throw new Error(
        "FlowBoxEntry can only be appended to a FlowBox container."
      );
    }
    this.parent = parent;
  }

  appendChild(child: GjsElement | string): void {
    ensureNotString(child);

    child.notifyWillAppendTo(this);
    this.children.addChild(child);
    this.widget.show_all();
  }

  notifyWillUnmount(child: GjsElement): void {
    this.children.removeChild(child);
  }

  remove(parent: GjsElement): void {
    parent.notifyWillUnmount(this);

    this.emitter.clear();
    this.propMapper.cleanupAll();
    this.widget.destroy();
  }

  updateProps(props: DiffedProps): void {
    this.propMapper.update(props);
  }

  render() {
    this.parent?.widget.show_all();
  }

  insertBefore(newChild: GjsElement | string, beforeChild: GjsElement): void {
    ensureNotString(newChild);

    newChild.notifyWillAppendTo(this);
    this.children.insertBefore(newChild, beforeChild);
    this.widget.show_all();
  }
}
