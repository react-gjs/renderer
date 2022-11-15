import { DataType } from "dilswer";
import Gtk from "gi://Gtk?version=3.0";
import { Orientation, SelectionMode } from "../../g-enums";
import type { GjsElement } from "../gjs-element";
import { EventHandlers } from "../utils/event-handlers";
import type { DiffedProps } from "../utils/map-properties";
import { createPropMap } from "../utils/map-properties";
import type { AlignmentProps } from "../utils/property-maps-factories/create-alignment-prop-mapper";
import { createAlignmentPropMapper } from "../utils/property-maps-factories/create-alignment-prop-mapper";
import type { MarginProps } from "../utils/property-maps-factories/create-margin-prop-mapper";
import { createMarginPropMapper } from "../utils/property-maps-factories/create-margin-prop-mapper";
import type { FlowBoxEntryElement } from "./flow-box-entry";

type FlowBoxPropsMixin = AlignmentProps & MarginProps;

export interface FlowBoxProps extends FlowBoxPropsMixin {
  orientation?: Orientation;
  columnSpacing?: number;
  activateOnSingleClick?: boolean;
  maxChildrenPerLine?: number;
  minChildrenPerLine?: number;
  rowSpacing?: number;
  selectionMode?: SelectionMode;
}

export class FlowBoxElement implements GjsElement<"FLOW_BOX"> {
  readonly kind = "FLOW_BOX";

  widget = new Gtk.FlowBox();
  private parent: Gtk.Container | null = null;

  private children: Array<FlowBoxEntryElement> = [];

  private handlers = new EventHandlers<Gtk.FlowBox, FlowBoxProps>(this.widget);

  private readonly propMapper = createPropMap<FlowBoxProps>(
    createAlignmentPropMapper(this.widget),
    createMarginPropMapper(this.widget),
    (props) =>
      props
        .orientation(
          DataType.Enum(Gtk.Orientation),
          (v = Orientation.HORIZONTAL) => {
            this.widget.orientation = v;
          }
        )
        .selectionMode(
          DataType.Enum(Gtk.SelectionMode),
          (v = SelectionMode.NONE) => {
            this.widget.selection_mode = v;
          }
        )
        .activateOnSingleClick(DataType.Boolean, (v = true) => {
          this.widget.activate_on_single_click = v;
        })
        .columnSpacing(DataType.Number, (v = 0) => {
          this.widget.column_spacing = v;
        })
        .maxChildrenPerLine(DataType.Number, (v = 999) => {
          this.widget.max_children_per_line = v;
        })
        .minChildrenPerLine(DataType.Number, (v = 0) => {
          this.widget.min_children_per_line = v;
        })
        .rowSpacing(DataType.Number, (v = 0) => {
          this.widget.row_spacing = v;
        })
  );

  constructor(props: any) {
    this.handlers.bindInternal("child-activated", (child: Gtk.FlowBoxChild) => {
      // @ts-ignore
      const childElement = this.children.find((c) => c.widget === child);
      if (childElement) {
        childElement.emitter.emit("activated");
      }
    });

    this.updateProps(props);
  }

  appendTo(parent: Gtk.Container): void {
    parent.add(this.widget);
    this.parent = parent;
  }

  appendChild(child: GjsElement<any> | string): void {
    if (typeof child === "string") {
      throw new Error("Box can only have other elements as it's children.");
    } else {
      if (child.kind === "FLOW_BOX_ENTRY") {
        this.widget.add(this.widget);
        this.children.push(child as FlowBoxEntryElement);
        this.widget.show_all();
      } else {
        throw new Error("FlowBox can only have FlexBoxEntry as it's children.");
      }
    }
  }

  remove(): void {
    this.propMapper.cleanupAll();
    this.handlers.unbindAll();
    this.widget.destroy();
  }

  updateProps(props: DiffedProps): void {
    this.propMapper.update(props);
  }

  render() {
    this.parent?.show_all();
  }

  childDestroyed(child: FlowBoxEntryElement) {
    this.children = this.children.filter((c) => c !== child);
  }
}
