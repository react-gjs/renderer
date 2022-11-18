import { DataType } from "dilswer";
import Gtk from "gi://Gtk";
import { Orientation, SelectionMode } from "../../g-enums";
import type { GjsElement } from "../gjs-element";
import { GjsElementManager } from "../gjs-element-manager";
import { EventHandlers } from "../utils/event-handlers";
import type { DiffedProps } from "../utils/map-properties";
import { createPropMap } from "../utils/map-properties";
import type { AlignmentProps } from "../utils/property-maps-factories/create-alignment-prop-mapper";
import { createAlignmentPropMapper } from "../utils/property-maps-factories/create-alignment-prop-mapper";
import type { MarginProps } from "../utils/property-maps-factories/create-margin-prop-mapper";
import { createMarginPropMapper } from "../utils/property-maps-factories/create-margin-prop-mapper";
import { FlowBoxEntryElement } from "./flow-box-entry";

type FlowBoxPropsMixin = AlignmentProps & MarginProps;

export interface FlowBoxProps extends FlowBoxPropsMixin {
  orientation?: Orientation;
  columnSpacing?: number;
  activateOnSingleClick?: boolean;
  maxChildrenPerLine?: number;
  minChildrenPerLine?: number;
  rowSpacing?: number;
  selectionMode?: SelectionMode;
  sameSizeChildren?: boolean;
}

export class FlowBoxElement implements GjsElement<"FLOW_BOX", Gtk.FlowBox> {
  readonly kind = "FLOW_BOX";

  widget = new Gtk.FlowBox();
  private parent: GjsElement | null = null;

  private children: Array<{
    element: FlowBoxEntryElement;
    isSelected: boolean;
  }> = [];

  private handlers = new EventHandlers<Gtk.FlowBox, FlowBoxProps>(this.widget);

  private readonly propMapper = createPropMap<FlowBoxProps>(
    createAlignmentPropMapper(this.widget),
    createMarginPropMapper(this.widget),
    (props) =>
      props
        .orientation(
          DataType.Enum(Gtk.Orientation),
          (v = Orientation.HORIZONTAL) => {
            this.widget.orientation =
              v === Orientation.HORIZONTAL
                ? Orientation.VERTICAL
                : Orientation.HORIZONTAL;
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
        .sameSizeChildren(DataType.Boolean, (v = false) => {
          this.widget.homogeneous = v;
        })
  );

  constructor(props: any) {
    this.handlers.bindInternal("selected-children-changed", () => {
      const newUnselected: FlowBoxEntryElement[] = [];
      const newSelected: FlowBoxEntryElement[] = [];

      for (const childEntry of this.children) {
        const currentlySelected = childEntry.element.widget.is_selected();
        if (currentlySelected !== childEntry.isSelected) {
          if (currentlySelected) {
            newSelected.push(childEntry.element);
          } else {
            newUnselected.push(childEntry.element);
          }
          childEntry.isSelected = currentlySelected;
        }
      }

      for (let i = 0; i < newUnselected.length; i++) {
        newUnselected[i].emitter.emit("selected", false);
      }

      for (let i = 0; i < newSelected.length; i++) {
        newSelected[i].emitter.emit("selected", true);
      }
    });

    this.updateProps(props);
  }

  notifyWillAppendTo(parent: GjsElement): void {
    this.parent = parent;
  }

  appendChild(child: GjsElement | string): void {
    if (typeof child === "string") {
      throw new Error("Box can only have other elements as it's children.");
    } else {
      if (GjsElementManager.isGjsElementOfKind(child, FlowBoxEntryElement)) {
        child.notifyWillAppendTo(this);
        this.widget.add(child.widget);
        this.children.push({
          element: child,
          isSelected: false,
        });
        this.widget.show_all();
      } else {
        throw new Error("FlowBox can only have FlexBoxEntry as it's children.");
      }
    }
  }

  notifyWillUnmount(child: GjsElement) {
    this.children = this.children.filter((c) => c.element !== child);
  }

  remove(parent: GjsElement): void {
    parent.notifyWillUnmount(this);

    this.propMapper.cleanupAll();
    this.handlers.unbindAll();
    this.widget.destroy();
  }

  updateProps(props: DiffedProps): void {
    this.propMapper.update(props);
  }

  render() {
    this.parent?.widget.show_all();
  }

  insertBefore(newChild: GjsElement, beforeChild: GjsElement): void {
    if (GjsElementManager.isGjsElementOfKind(newChild, FlowBoxEntryElement)) {
      newChild.notifyWillAppendTo(this);

      const beforeIndex = this.children.findIndex(
        (c) => c.element === beforeChild
      );

      const childrenAfter = this.children.slice(beforeIndex);
      const tmpContainer = new Gtk.FlowBox();

      for (let i = 0; i < childrenAfter.length; i++) {
        tmpContainer.add(childrenAfter[i].element.widget);
        this.widget.remove(childrenAfter[i].element.widget);
      }

      this.widget.add(newChild.widget);

      for (let i = 0; i < childrenAfter.length; i++) {
        this.widget.add(childrenAfter[i].element.widget);
        tmpContainer.remove(childrenAfter[i].element.widget);
      }

      tmpContainer.destroy();

      this.children.splice(beforeIndex, 0, {
        element: newChild,
        isSelected: false,
      });
    }
  }
}
