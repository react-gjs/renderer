import { DataType } from "dilswer";
import type Gtk from "gi://Gtk";
import { PopoverConstraint, PositionType } from "../../../g-enums";
import type { GjsContext } from "../../../reconciler/gjs-renderer";
import type { HostContext } from "../../../reconciler/host-context";
import type { GjsElement } from "../../gjs-element";
import { GjsElementManager } from "../../gjs-element-manager";
import { diffProps } from "../../utils/diff-props";
import { ElementLifecycleController } from "../../utils/element-extenders/element-lifecycle-controller";
import type { DiffedProps } from "../../utils/element-extenders/map-properties";
import { PropertyMapper } from "../../utils/element-extenders/map-properties";
import type { AlignmentProps } from "../../utils/property-maps-factories/create-alignment-prop-mapper";
import { createAlignmentPropMapper } from "../../utils/property-maps-factories/create-alignment-prop-mapper";
import type { ExpandProps } from "../../utils/property-maps-factories/create-expand-prop-mapper";
import { createExpandPropMapper } from "../../utils/property-maps-factories/create-expand-prop-mapper";
import type { MarginProps } from "../../utils/property-maps-factories/create-margin-prop-mapper";
import { createMarginPropMapper } from "../../utils/property-maps-factories/create-margin-prop-mapper";
import type { StyleProps } from "../../utils/property-maps-factories/create-style-prop-mapper";
import { createStylePropMapper } from "../../utils/property-maps-factories/create-style-prop-mapper";
import { Bin } from "../../utils/widgets/bin";
import type { TextNode } from "../markup/text-node";
import { PopoverContentElement } from "./popover-content";
import { PopoverTargetElement } from "./popover-target";

type PopoverPropsMixin = AlignmentProps &
  MarginProps &
  ExpandProps &
  StyleProps;

export interface PopoverProps extends PopoverPropsMixin {
  isModal?: boolean;
  constraint?: PopoverConstraint;
  position?: PositionType;
}

export type PopoverInternalProps = {
  popoverWidget: Gtk.Popover;
};

export class PopoverElement implements GjsElement<"POPOVER", Bin> {
  static getContext(
    currentContext: HostContext<GjsContext>
  ): HostContext<GjsContext> {
    return currentContext;
  }

  readonly kind = "POPOVER";
  widget = new Bin();
  popover!: Gtk.Popover;

  private parent: GjsElement | null = null;

  readonly lifecycle = new ElementLifecycleController();
  private readonly propsMapper = new PropertyMapper<
    PopoverProps & PopoverInternalProps
  >(
    this.lifecycle,
    createAlignmentPropMapper(this.widget),
    createMarginPropMapper(this.widget),
    createExpandPropMapper(this.widget),
    createStylePropMapper(this.widget),
    (props) =>
      props
        .popoverWidget(DataType.Unknown, (popoverWidget) => {
          this.popover = popoverWidget as Gtk.Popover;
          this.popover.set_relative_to(this.widget);
        })
        .isModal(DataType.Boolean, (v = false) => {
          this.popover.set_modal(v);
        })
        .constraint(
          DataType.Enum(PopoverConstraint),
          (v = PopoverConstraint.NONE) => {
            this.popover.set_constrain_to(v);
          }
        )
        .position(DataType.Enum(PositionType), (v = PositionType.BOTTOM) => {
          this.popover.set_position(v);
        })
  );

  private hasContentChild = false;
  private contentElement?: PopoverContentElement;
  private hasTarget = false;
  private targetElement?: PopoverTargetElement;

  constructor(props: DiffedProps) {
    this.propsMapper.skipDefaults();
    this.updateProps(props);

    this.lifecycle.emitLifecycleEventAfterCreate();
  }

  onContentChange() {
    if (this.targetElement) this.popover.add(this.targetElement.widget);
  }

  onTargetChange() {
    if (this.contentElement) this.widget.add(this.contentElement.widget);
  }

  updateProps(props: DiffedProps): void {
    this.lifecycle.emitLifecycleEventUpdate(props);
  }

  // #region This widget direct mutations

  appendChild(child: GjsElement | TextNode): void {
    if (GjsElementManager.isGjsElementOfKind(child, PopoverContentElement)) {
      if (this.hasContentChild) {
        throw new Error("Popover can only have one child");
      }
      const shouldAppend = child.notifyWillAppendTo(this);
      if (shouldAppend) {
        this.popover.add(child.widget);
        this.hasContentChild = true;
        this.contentElement = child;
      }
    } else if (
      GjsElementManager.isGjsElementOfKind(child, PopoverTargetElement)
    ) {
      if (this.hasTarget) {
        throw new Error("Popover can only have one target");
      }
      const shouldAppend = child.notifyWillAppendTo(this);
      if (shouldAppend) {
        this.widget.add(child.widget);
        this.hasTarget = true;
        this.targetElement = child;
      }
    } else {
      throw new Error(
        "Popover can only have one PopoverTarget and one PopoverContent as it's children."
      );
    }
  }

  insertBefore(newChild: GjsElement | TextNode): void {
    // TODO: proper handling of insertBefore
    this.appendChild(newChild);
  }

  remove(parent: GjsElement): void {
    parent.notifyWillUnmount(this);

    this.lifecycle.emitLifecycleEventBeforeDestroy();

    this.widget.destroy();
    this.popover.destroy();
  }

  render() {
    this.parent?.widget.show_all();
  }

  // #endregion

  // #region Element internal signals

  notifyWillAppendTo(parent: GjsElement): boolean {
    this.parent = parent;
    return true;
  }

  notifyWillUnmount(child: GjsElement): void {
    if (GjsElementManager.isGjsElementOfKind(child, PopoverContentElement)) {
      this.hasContentChild = false;
      this.contentElement = undefined;
    } else if (
      GjsElementManager.isGjsElementOfKind(child, PopoverTargetElement)
    ) {
      this.hasTarget = false;
      this.targetElement = undefined;
    }
  }

  // #endregion

  // #region Utils for external use

  show() {
    this.widget.visible = true;
  }

  hide() {
    this.widget.visible = false;
  }

  diffProps(
    oldProps: Record<string, any>,
    newProps: Record<string, any>
  ): DiffedProps {
    return diffProps(oldProps, newProps, true);
  }

  // #endregion
}
