import { DataType } from "dilswer";
import Gtk from "gi://Gtk";
import type {
  BaselinePosition,
  Orientation,
  SizeGroupMode,
} from "../../../enums/gtk3-index";
import type { GjsContext } from "../../../reconciler/gjs-renderer";
import type { HostContext } from "../../../reconciler/host-context";
import { BaseElement, type GjsElement } from "../../gjs-element";
import { ChildOrderController } from "../../utils/element-extenders/child-order-controller";
import { ElementLifecycleController } from "../../utils/element-extenders/element-lifecycle-controller";
import { EventHandlers } from "../../utils/element-extenders/event-handlers";
import type { DiffedProps } from "../../utils/element-extenders/map-properties";
import { PropertyMapper } from "../../utils/element-extenders/map-properties";
import { ensureNotText } from "../../utils/ensure-not-string";
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

type SizeGroupBoxPropsMixin = ChildPropertiesProps &
  SizeRequestProps &
  AlignmentProps &
  MarginProps &
  ExpandProps &
  StyleProps;

export interface SizeGroupBoxProps extends SizeGroupBoxPropsMixin {
  spacing?: number;
  baselinePosition?: BaselinePosition;
  orientation?: Orientation;
  mode?: SizeGroupMode;
}

export class SizeGroupBoxElement
  extends BaseElement
  implements GjsElement<"SIZE_GROUP_BOX", Gtk.Box>
{
  static getContext(
    currentContext: HostContext<GjsContext>,
  ): HostContext<GjsContext> {
    return currentContext;
  }

  readonly kind = "SIZE_GROUP_BOX";
  protected widget = new Gtk.Box();
  sizeGroup = new Gtk.SizeGroup();

  protected parent: GjsElement | null = null;

  readonly lifecycle = new ElementLifecycleController();
  protected readonly handlers = new EventHandlers<
    Gtk.Box,
    SizeGroupBoxProps
  >(this);
  protected readonly children = new ChildOrderController(
    this.lifecycle,
    this.widget,
  );
  protected readonly propsMapper =
    new PropertyMapper<SizeGroupBoxProps>(
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
          .spacing(DataType.Number, (v = 0) => {
            this.widget.spacing = v;
          })
          .baselinePosition(
            DataType.Enum(Gtk.BaselinePosition),
            (v = Gtk.BaselinePosition.TOP) => {
              this.widget.baseline_position = v;
            },
          )
          .orientation(
            DataType.Enum(Gtk.Orientation),
            (v = Gtk.Orientation.VERTICAL) => {
              this.widget.orientation = v;
            },
          )
          .mode(
            DataType.Enum(Gtk.SizeGroupMode),
            (v = Gtk.SizeGroupMode.BOTH) => {
              this.sizeGroup.mode = v;
            },
          ),
    );

  constructor(props: DiffedProps) {
    super();
    this.updateProps(props);

    this.lifecycle.emitLifecycleEventAfterCreate();
  }

  updateProps(props: DiffedProps): void {
    this.lifecycle.emitLifecycleEventUpdate(props);
  }

  // #region This widget direct mutations

  appendChild(child: GjsElement | TextNode): void {
    ensureNotText(child);

    mountAction(
      this,
      child,
      (shouldOmitMount) => {
        if (shouldOmitMount) {
          this.sizeGroup.add_widget(child.getWidget());
        }
        this.children.addChild(child, shouldOmitMount);
      },
      () => {
        this.widget.show_all();
      },
    );
  }

  insertBefore(
    child: GjsElement | TextNode,
    beforeChild: GjsElement,
  ): void {
    ensureNotText(child);

    mountAction(
      this,
      child,
      (shouldOmitMount) => {
        if (shouldOmitMount) {
          this.sizeGroup.add_widget(child.getWidget());
        }
        this.children.insertBefore(
          child,
          beforeChild,
          shouldOmitMount,
        );
      },
      () => {
        this.widget.show_all();
      },
    );
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

  notifyChildWillUnmount(child: GjsElement): void {
    this.sizeGroup.remove_widget(child.getWidget());
    this.children.removeChild(child);
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
