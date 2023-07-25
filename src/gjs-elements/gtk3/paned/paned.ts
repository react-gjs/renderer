import { DataType } from "dilswer";
import Gtk from "gi://Gtk";
import type { Orientation } from "../../../enums/gtk3-index";
import type { GjsContext } from "../../../reconciler/gjs-renderer";
import type { HostContext } from "../../../reconciler/host-context";
import { BaseElement, type GjsElement } from "../../gjs-element";
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

type PanedPropsMixin = ChildPropertiesProps &
  SizeRequestProps &
  AlignmentProps &
  MarginProps &
  ExpandProps &
  StyleProps;

export interface PanedProps extends PanedPropsMixin {
  orientation?: Orientation;
  wideHandle?: boolean;
  resizeChildren?: boolean;
  shrinkChildren?: boolean;
}

export class PanedElement
  extends BaseElement
  implements GjsElement<"PANED", Gtk.Paned>
{
  static getContext(
    currentContext: HostContext<GjsContext>,
  ): HostContext<GjsContext> {
    return currentContext;
  }

  readonly kind = "PANED";
  protected widget = new Gtk.Paned();

  protected parent: GjsElement | null = null;

  readonly lifecycle = new ElementLifecycleController();
  protected readonly handlers = new EventHandlers<
    Gtk.Paned,
    PanedProps
  >(this);
  protected readonly children: [
    GjsElement | null,
    GjsElement | null,
  ] = [null, null];
  protected readonly propsMapper = new PropertyMapper<PanedProps>(
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
          (v = Gtk.Orientation.VERTICAL) => {
            this.widget.set_orientation(v);
          },
        )
        .wideHandle(DataType.Boolean, (v = false) => {
          this.widget.set_wide_handle(v);
        })
        .resizeChildren(DataType.Boolean, (v = true) => {
          this.children.forEach((child) => {
            if (child) this.applyResize(child, v);
          });
        })
        .shrinkChildren(DataType.Boolean, (v = true) => {
          this.children.forEach((child) => {
            if (child) this.applyShrink(child, v);
          });
        }),
  );

  constructor(props: DiffedProps) {
    super();
    this.updateProps(props);

    this.lifecycle.emitLifecycleEventAfterCreate();
  }

  protected applyResize(child: GjsElement, resizable: boolean) {
    this.widget.child_set_property(
      child.getWidget(),
      "resize",
      resizable,
    );
  }

  protected applyShrink(child: GjsElement, shrinkable: boolean) {
    this.widget.child_set_property(
      child.getWidget(),
      "shrink",
      shrinkable,
    );
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
        if (!shouldOmitMount) {
          if (this.children[0] == null) {
            this.children[0] = child;
            this.widget.add1(child.getWidget());
          } else if (this.children[1] == null) {
            this.children[1] = child;
            this.widget.add2(child.getWidget());
          } else {
            throw new Error(
              "Paned can only have up to two children.",
            );
          }
        }
      },
      () => {
        this.widget.show_all();
      },
    );

    const shouldAppend = child.notifyWillMountTo(this);
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
        if (!shouldOmitMount) {
          if (
            this.children[1] === beforeChild &&
            this.children[0] == null
          ) {
            this.children[0] = child;
            this.widget.add1(child.getWidget());
          } else if (
            this.children[0] === beforeChild &&
            this.children[1] == null
          ) {
            this.widget.remove(this.children[0].getWidget());
            this.children[1] = this.children[0];
            this.children[0] = child;
            this.widget.add1(this.children[0].getWidget());
            this.widget.add2(this.children[1].getWidget());
          } else if (
            this.children[0] === beforeChild &&
            this.children[1] === child
          ) {
            this.widget.remove(this.children[0].getWidget());
            this.widget.remove(this.children[1].getWidget());
            this.children[0] = child;
            this.children[1] = beforeChild;
            this.widget.add1(this.children[0].getWidget());
            this.widget.add2(this.children[1].getWidget());
          } else {
            throw new Error(
              "Unable to insert a children into this Paned element.",
            );
          }
        }
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
    if (this.children[1] === child) {
      this.children[1] = null;
    } else if (this.children[0] === child) {
      if (this.children[1]) {
        this.widget.remove(this.children[0].getWidget());
        this.widget.remove(this.children[1].getWidget());
        this.children[0] = this.children[1];
        this.children[1] = null;
        this.widget.add1(this.children[0].getWidget());
      } else {
        this.children[0] = null;
      }
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

  getWidget() {
    return this.widget;
  }

  getParentElement() {
    return this.parent;
  }

  // #endregion
}
