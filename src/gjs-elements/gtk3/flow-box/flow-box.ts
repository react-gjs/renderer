import { DataType } from "dilswer";
import Gtk from "gi://Gtk";
import type { Orientation } from "../../../enums/gtk3-index";
import { EventPhase } from "../../../reconciler/event-phase";
import type { GjsContext } from "../../../reconciler/gjs-renderer";
import type { HostContext } from "../../../reconciler/host-context";
import { BaseElement, type GjsElement } from "../../gjs-element";
import { GjsElementManager } from "../../gjs-element-manager";
import { ElementLifecycleController } from "../../utils/element-extenders/element-lifecycle-controller";
import { EventHandlers } from "../../utils/element-extenders/event-handlers";
import type { DiffedProps } from "../../utils/element-extenders/map-properties";
import { PropertyMapper } from "../../utils/element-extenders/map-properties";
import { mountAction } from "../../utils/mount-action";
import type { AlignmentProps } from "../../utils/property-maps-factories/create-alignment-prop-mapper";
import { createAlignmentPropMapper } from "../../utils/property-maps-factories/create-alignment-prop-mapper";
import type { ChildPropertiesProps } from "../../utils/property-maps-factories/create-child-props-mapper";
import { createChildPropsMapper } from "../../utils/property-maps-factories/create-child-props-mapper";
import type { ExpandProps } from "../../utils/property-maps-factories/create-expand-prop-mapper";
import { createExpandPropMapper } from "../../utils/property-maps-factories/create-expand-prop-mapper";
import type { MarginProps } from "../../utils/property-maps-factories/create-margin-prop-mapper";
import { createMarginPropMapper } from "../../utils/property-maps-factories/create-margin-prop-mapper";
import type { SizeRequestProps } from "../../utils/property-maps-factories/create-size-request-prop-mapper";
import { createSizeRequestPropMapper } from "../../utils/property-maps-factories/create-size-request-prop-mapper";
import type { StyleProps } from "../../utils/property-maps-factories/create-style-prop-mapper";
import { createStylePropMapper } from "../../utils/property-maps-factories/create-style-prop-mapper";
import type { TextNode } from "../text-node";
import { FlowBoxEntryElement } from "./flow-box-entry";

type FlowBoxPropsMixin =
  & ChildPropertiesProps
  & SizeRequestProps
  & AlignmentProps
  & MarginProps
  & ExpandProps
  & StyleProps;

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

export class FlowBoxElement extends BaseElement implements GjsElement<"FLOW_BOX", Gtk.FlowBox> {
  static getContext(
    currentContext: HostContext<GjsContext>,
  ): HostContext<GjsContext> {
    return currentContext;
  }

  readonly kind = "FLOW_BOX";
  protected widget = new Gtk.FlowBox();

  protected children: Array<{
    element: FlowBoxEntryElement;
    isSelected: boolean;
  }> = [];

  protected parent: GjsElement | null = null;

  readonly lifecycle = new ElementLifecycleController();
  protected handlers = new EventHandlers<Gtk.FlowBox, FlowBoxProps>(
    this,
  );
  protected readonly propsMapper = new PropertyMapper<FlowBoxProps>(
    this.lifecycle,
    createSizeRequestPropMapper(this.widget),
    createAlignmentPropMapper(this.widget),
    createMarginPropMapper(this.widget),
    createExpandPropMapper(this.widget),
    createStylePropMapper(this.widget),
    createChildPropsMapper(
      () => this.widget,
      () => this.parent,
    ),
    (props) =>
      props
        .orientation(
          DataType.Enum(Gtk.Orientation),
          (v = Gtk.Orientation.HORIZONTAL) => {
            this.widget.orientation = v === Gtk.Orientation.HORIZONTAL
              ? Gtk.Orientation.VERTICAL
              : Gtk.Orientation.HORIZONTAL;
          },
        )
        .selectionMode(
          DataType.Enum(Gtk.SelectionMode),
          (v = Gtk.SelectionMode.NONE) => {
            this.widget.selection_mode = v;
          },
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
        }),
  );

  protected isAnyChildSelected = false;

  constructor(props: DiffedProps) {
    super();
    this.handlers.bindInternal(
      "selected-children-changed",
      () => {
        this.isAnyChildSelected = true;
        const newUnselected: FlowBoxEntryElement[] = [];
        const newSelected: FlowBoxEntryElement[] = [];

        for (const childEntry of this.children) {
          const currentlySelected = childEntry.element
            .getWidget()
            .is_selected();
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
      },
      EventPhase.Input,
    );

    this.updateProps(props);

    this.lifecycle.emitLifecycleEventAfterCreate();
  }

  updateProps(props: DiffedProps): void {
    this.lifecycle.emitLifecycleEventUpdate(props);
  }

  // #region This widget direct mutations

  appendChild(child: GjsElement | TextNode): void {
    if (typeof child === "string") {
      throw new Error(
        "Box can only have other elements as it's children.",
      );
    } else {
      if (
        GjsElementManager.isGjsElementOfKind(
          child,
          FlowBoxEntryElement,
        )
      ) {
        // TODO: handle should append logic
        mountAction(
          this,
          child,
          (shouldOmitMount) => {
            this.widget.add(child.getWidget());
            const entry = {
              element: child,
              isSelected: false,
            };
            this.children.push(entry);
            if (child.isDefault && !this.isAnyChildSelected) {
              this.widget.select_child(child.getWidget());
              entry.isSelected = true;
            }
          },
          () => {
            this.widget.show_all();
          },
        );
      } else {
        throw new Error(
          "FlowBox can only have FlexBoxEntry as it's children.",
        );
      }
    }
  }

  insertBefore(child: GjsElement, beforeChild: GjsElement): void {
    if (
      GjsElementManager.isGjsElementOfKind(child, FlowBoxEntryElement)
    ) {
      // TODO: handle should append logic
      mountAction(
        this,
        child,
        (shouldOmitMount) => {
          const beforeIndex = this.children.findIndex(
            (c) => c.element === beforeChild,
          );

          const childrenAfter = this.children.slice(beforeIndex);
          const tmpContainer = new Gtk.FlowBox();

          for (let i = 0; i < childrenAfter.length; i++) {
            tmpContainer.add(childrenAfter[i].element.getWidget());
            this.widget.remove(childrenAfter[i].element.getWidget());
          }

          this.widget.add(child.getWidget());

          for (let i = 0; i < childrenAfter.length; i++) {
            this.widget.add(childrenAfter[i].element.getWidget());
            tmpContainer.remove(childrenAfter[i].element.getWidget());
          }

          tmpContainer.destroy();

          this.children.splice(beforeIndex, 0, {
            element: child,
            isSelected: false,
          });
        },
        () => {
          this.widget.show_all();
        },
      );
    }
  }

  remove(parent: GjsElement): void {
    parent.notifyChildWillUnmount(this);

    this.lifecycle.emitLifecycleEventBeforeDestroy();

    this.widget.destroy();
  }

  render() {
    this.widget.show_all();
  }

  // #endregion

  // #region Element internal signals

  notifyWillMountTo(parent: GjsElement): boolean {
    this.parent = parent;
    return true;
  }

  notifyMounted(): void {
    this.lifecycle.emitMountedEvent();
  }

  notifyChildWillUnmount(child: GjsElement) {
    this.children = this.children.filter((c) => c.element !== child);
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

  // #endregion
}
