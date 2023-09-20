import { DataType } from "dilswer";
import Gtk from "gi://Gtk";
import type { GjsContext } from "../../../reconciler/gjs-renderer";
import type { HostContext } from "../../../reconciler/host-context";
import { BaseElement, type GjsElement } from "../../gjs-element";
import { GjsElementManager } from "../../gjs-element-manager";
import { ElementLifecycleController } from "../../utils/element-extenders/element-lifecycle-controller";
import { EventHandlers } from "../../utils/element-extenders/event-handlers";
import type { DiffedProps } from "../../utils/element-extenders/map-properties";
import { PropertyMapper } from "../../utils/element-extenders/map-properties";
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
import { ToolbarElement } from "./toolbar";

type ToolbarSeparatorPropsMixin = ChildPropertiesProps &
  SizeRequestProps &
  AlignmentProps &
  MarginProps &
  ExpandProps &
  StyleProps;

export interface ToolbarSeparatorProps
  extends ToolbarSeparatorPropsMixin {
  sameSize?: boolean;
  expand?: boolean;
  show?: boolean;
}

export class ToolbarSeparatorElement
  extends BaseElement
  implements GjsElement<"TOOLBAR_SEPARATOR", Gtk.SeparatorToolItem>
{
  static getContext(
    currentContext: HostContext<GjsContext>,
  ): HostContext<GjsContext> {
    return currentContext;
  }

  readonly kind = "TOOLBAR_SEPARATOR";
  protected widget = new Gtk.SeparatorToolItem();

  protected parent: GjsElement | null = null;

  readonly lifecycle = new ElementLifecycleController();
  protected readonly handlers = new EventHandlers<
    Gtk.SeparatorToolItem,
    ToolbarSeparatorProps
  >(this);
  protected readonly propsMapper =
    new PropertyMapper<ToolbarSeparatorProps>(
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
          .sameSize(DataType.Boolean, (v = true) => {
            this.widget.set_homogeneous(v);
          })
          .expand(DataType.Boolean, (v = false) => {
            this.widget.set_expand(v);
          })
          .show(DataType.Boolean, (v = true) => {
            this.widget.set_draw(v);
          }),
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

  appendChild(): void {
    throw new Error("Separator cannot have children.");
  }

  insertBefore(): void {
    throw new Error("Separator cannot have children.");
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
    if (
      GjsElementManager.isGjsElementOfKind(parent, ToolbarElement)
    ) {
      this.parent = parent;
    } else {
      throw new Error(
        "ToolbarButton can only be a child of a toolbar.",
      );
    }
    return true;
  }

  notifyMounted(): void {
    this.lifecycle.emitMountedEvent();
  }

  notifyChildWillUnmount() {}

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
