import { DataType } from "dilswer";
import Gtk from "gi://Gtk";
import type { IconSize, Orientation, ToolbarStyle } from "../../../enums/gtk3-index";
import type { GjsContext } from "../../../reconciler/gjs-renderer";
import type { HostContext } from "../../../reconciler/host-context";
import { BaseElement, type GjsElement } from "../../gjs-element";
import { GjsElementManager } from "../../gjs-element-manager";
import { ChildOrderController } from "../../utils/element-extenders/child-order-controller";
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
import { ToolbarButtonElement } from "./toolbar-button";
import { ToolbarItemElement } from "./toolbar-item";
import { ToolbarRadioButtonElement } from "./toolbar-radio-button";
import { ToolbarSeparatorElement } from "./toolbar-separator";
import { ToolbarToggleButtonElement } from "./toolbar-toggle-button";

export type GjsToolbarElement<
  K extends
    | keyof Rg.GjsElementTypeRegistry
    | "APPLICATION" = keyof Rg.GjsElementTypeRegistry,
> = GjsElement<K, Gtk.ToolItem>;

type ToolbarPropsMixin =
  & ChildPropertiesProps
  & SizeRequestProps
  & AlignmentProps
  & MarginProps
  & ExpandProps
  & StyleProps;

export interface ToolbarProps extends ToolbarPropsMixin {
  orientation?: Orientation;
  type?: ToolbarStyle;
  showArrow?: boolean;
  iconSize?: IconSize;
}

const TOOL_ELEMENTS = [
  ToolbarButtonElement,
  ToolbarSeparatorElement,
  ToolbarItemElement,
  ToolbarRadioButtonElement,
  ToolbarToggleButtonElement,
];

export class ToolbarElement extends BaseElement implements GjsElement<"TOOLBAR", Gtk.Toolbar> {
  static getContext(
    currentContext: HostContext<GjsContext>,
  ): HostContext<GjsContext> {
    return currentContext;
  }

  readonly kind = "TOOLBAR";
  protected widget = new Gtk.Toolbar();

  protected parent: GjsElement | null = null;

  readonly lifecycle = new ElementLifecycleController();
  protected readonly handlers = new EventHandlers<
    Gtk.Toolbar,
    ToolbarProps
  >(this);
  protected readonly children = new ChildOrderController<GjsToolbarElement>(
    this.lifecycle,
    this.widget,
    (child) => {
      this.widget.insert(child, -1);
    },
  );
  protected readonly propsMapper = new PropertyMapper<ToolbarProps>(
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
            this.widget.orientation = v;
          },
        )
        .showArrow(DataType.Boolean, (v = true) => {
          this.widget.show_arrow = v;
        })
        .type(
          DataType.Enum(Gtk.ToolbarStyle),
          (v = Gtk.ToolbarStyle.ICONS) => {
            this.widget.toolbar_style = v;
          },
        )
        .iconSize(DataType.Enum(Gtk.IconSize), (v) => {
          if (v) {
            const defaultSize = this.widget.icon_size;
            this.widget.icon_size = v;
            return () => {
              this.widget.icon_size = defaultSize;
            };
          }
        }),
  );

  protected radioGroups = new Map<string, Gtk.RadioToolButton>();

  constructor(props: DiffedProps) {
    super();
    this.updateProps(props);

    this.lifecycle.emitLifecycleEventAfterCreate();
  }

  getRadioGroup(groupName: string) {
    if (this.radioGroups.has(groupName)) {
      return this.radioGroups.get(groupName)!;
    }
    const radioGroup = new Gtk.RadioToolButton();
    this.radioGroups.set(groupName, radioGroup);
    return radioGroup;
  }

  updateProps(props: DiffedProps): void {
    this.lifecycle.emitLifecycleEventUpdate(props);
  }

  // #region This widget direct mutations

  appendChild(child: GjsElement | TextNode): void {
    if (GjsElementManager.isGjsElementOfKind(child, TOOL_ELEMENTS)) {
      mountAction(
        this,
        child,
        (shouldOmitMount) => {
          this.children.addChild(child, shouldOmitMount);
        },
        () => {
          this.widget.show_all();
        },
      );
    } else {
      throw new Error("Invalid child element added to toolbar.");
    }
  }

  insertBefore(
    child: GjsElement | TextNode,
    beforeChild: GjsElement,
  ): void {
    if (GjsElementManager.isGjsElementOfKind(child, TOOL_ELEMENTS)) {
      mountAction(
        this,
        child,
        (shouldOmitMount) => {
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
    } else {
      throw new Error("Invalid child element added to toolbar.");
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

  notifyChildWillUnmount(child: GjsElement): void {
    this.children.removeChild(child as GjsToolbarElement);
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
