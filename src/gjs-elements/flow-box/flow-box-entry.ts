import { DataType } from "dilswer";
import Gtk from "gi://Gtk";
import { FlowBoxElement } from "../flow-box/flow-box";
import type { GjsElement } from "../gjs-element";
import { GjsElementManager } from "../gjs-element-manager";
import type { DiffedProps } from "../utils/map-properties";
import { createPropMap } from "../utils/map-properties";
import type { AlignmentProps } from "../utils/property-maps-factories/create-alignment-prop-mapper";
import { createAlignmentPropMapper } from "../utils/property-maps-factories/create-alignment-prop-mapper";
import type { MarginProps } from "../utils/property-maps-factories/create-margin-prop-mapper";
import { createMarginPropMapper } from "../utils/property-maps-factories/create-margin-prop-mapper";
import { SyntheticEmitter } from "../utils/synthetic-emitter";

type FlowBoxEntryPropsMixin = AlignmentProps & MarginProps;

export interface FlowBoxEntryProps extends FlowBoxEntryPropsMixin {
  onSelect?: () => void;
}

export class FlowBoxEntryElement
  implements GjsElement<"FLOW_BOX_ENTRY", Gtk.FlowBoxChild>
{
  readonly kind = "FLOW_BOX_ENTRY";

  widget = new Gtk.FlowBoxChild();
  private parent: FlowBoxElement | null = null;

  emitter = new SyntheticEmitter<{ selected: [] }>();

  private readonly propMapper = createPropMap<FlowBoxEntryProps>(
    createAlignmentPropMapper(this.widget),
    createMarginPropMapper(this.widget),
    (props) =>
      props.onSelect(DataType.Function, (callback) => {
        if (callback) {
          const listener = this.emitter.on("selected", () => callback());
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
    if (typeof child === "string") {
      throw new Error("Box can only have other elements as it's children.");
    } else {
      child.notifyWillAppendTo(this);
      this.widget.add(child.widget);
      this.widget.show_all();
    }
  }

  remove(parent: GjsElement): void {
    this.emitter.clear();
    this.parent?.childDestroyed(this);
    this.propMapper.cleanupAll();
    this.widget.destroy();
  }

  updateProps(props: DiffedProps): void {
    this.propMapper.update(props);
  }

  render() {
    this.parent?.widget.show_all();
  }
}
