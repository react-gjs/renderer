import { DataType } from "dilswer";
import Gtk from "gi://Gtk";
import { ButtonType } from "../../../enums/custom";
import { EventPhase } from "../../../reconciler/event-phase";
import type { GjsContext } from "../../../reconciler/gjs-renderer";
import type { HostContext } from "../../../reconciler/host-context";
import { BaseElement, type GjsElement } from "../../gjs-element";
import { ElementLifecycleController } from "../../utils/element-extenders/element-lifecycle-controller";
import type { SyntheticEvent } from "../../utils/element-extenders/event-handlers";
import { EventHandlers } from "../../utils/element-extenders/event-handlers";
import type { DiffedProps } from "../../utils/element-extenders/map-properties";
import { PropertyMapper } from "../../utils/element-extenders/map-properties";
import { TextChildController } from "../../utils/element-extenders/text-child-controller";
import type { PointerData } from "../../utils/gdk-events/pointer-event";
import { parseCrossingEvent } from "../../utils/gdk-events/pointer-event";
import { mountAction } from "../../utils/mount-action";
import {
  parseColor,
  type ColorString,
} from "../../utils/parse-color";
import type { AccelProps } from "../../utils/property-maps-factories/create-accel-prop-mapper";
import { createAccelPropMapper } from "../../utils/property-maps-factories/create-accel-prop-mapper";
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
import type { TooltipProps } from "../../utils/property-maps-factories/create-tooltip-prop-mapper";
import { createTooltipPropMapper } from "../../utils/property-maps-factories/create-tooltip-prop-mapper";
import type { TextNode } from "../text-node";

type ColorButtonPropsMixin = ChildPropertiesProps &
  SizeRequestProps &
  AlignmentProps &
  MarginProps &
  ExpandProps &
  StyleProps &
  TooltipProps &
  AccelProps;

export type ColorButtonEvent<P extends Record<string, any> = {}> =
  SyntheticEvent<P, ColorButtonElement>;

export interface ColorButtonProps extends ColorButtonPropsMixin {
  type?: ButtonType;
  label?: string;
  useUnderline?: boolean;
  focusOnClick?: boolean;
  color?: ColorString;
  showEditor?: boolean;
  title?: string;
  useAlpha?: boolean;
  onChange?: (event: ColorButtonEvent<{ color: string }>) => void;
  onClick?: (event: ColorButtonEvent) => void;
  onActivate?: (event: ColorButtonEvent) => void;
  onPressed?: (event: ColorButtonEvent) => void;
  onReleased?: (event: ColorButtonEvent) => void;
  onMouseEnter?: (event: ColorButtonEvent<PointerData>) => void;
  onMouseLeave?: (event: ColorButtonEvent<PointerData>) => void;
}

export class ColorButtonElement
  extends BaseElement
  implements GjsElement<"COLOR_BUTTON", Gtk.ColorButton>
{
  static getContext(
    currentContext: HostContext<GjsContext>,
  ): HostContext<GjsContext> {
    return currentContext.set({
      isInTextContext: true,
    });
  }

  static getNewGtkWidget() {
    return new Gtk.ColorButton();
  }

  readonly kind = "COLOR_BUTTON";
  protected widget = ColorButtonElement.getNewGtkWidget();

  protected parent: GjsElement | null = null;

  readonly lifecycle = new ElementLifecycleController();
  protected readonly handlers = new EventHandlers<
    Gtk.Button,
    ColorButtonProps
  >(this);
  protected readonly propsMapper =
    new PropertyMapper<ColorButtonProps>(
      this.lifecycle,
      createSizeRequestPropMapper(this.widget),
      createAlignmentPropMapper(this.widget),
      createMarginPropMapper(this.widget),
      createExpandPropMapper(this.widget),
      createStylePropMapper(this.widget),
      createTooltipPropMapper(this.widget),
      createAccelPropMapper(this.widget, "clicked"),
      createChildPropsMapper(
        () => this.widget,
        () => this.parent,
      ),
      (props) =>
        props
          .label(DataType.String, (v) => {
            this.widget.label = v ?? null;
          })
          .useUnderline(DataType.Boolean, (v = false) => {
            this.widget.use_underline = v;
          })
          .type(
            DataType.Enum(ButtonType),
            (v = ButtonType.NORMAL) => {
              switch (v) {
                case ButtonType.NORMAL:
                  this.widget.relief = Gtk.ReliefStyle.NORMAL;
                  break;
                case ButtonType.FLAT:
                  this.widget.relief = Gtk.ReliefStyle.NONE;
                  break;
              }
            },
          )
          .focusOnClick(DataType.Boolean, (v = true) => {
            this.widget.focus_on_click = v;
          })
          .color(DataType.String, (v) => {
            if (v) {
              this.widget.rgba = parseColor(
                v as ColorString,
              ).toRgba();
            }
          })
          .showEditor(DataType.Boolean, (v = false) => {
            this.widget.show_editor = v;
          })
          .title(DataType.String, (v) => {
            this.widget.title = v ?? null;
          })
          .useAlpha(DataType.Boolean, (v = true) => {
            this.widget.use_alpha = v;
          }),
    );

  protected readonly children = new TextChildController(
    this.lifecycle,
    (text) => {
      this.widget.label = text;
    },
  );

  constructor(props: DiffedProps) {
    super();
    this.handlers.bind("clicked", "onClick");
    this.handlers.bind("activate", "onActivate");
    this.handlers.bind("pressed", "onPressed");
    this.handlers.bind("released", "onReleased");
    this.handlers.bind(
      "enter-notify-event",
      "onMouseEnter",
      parseCrossingEvent,
      EventPhase.Action,
    );
    this.handlers.bind(
      "leave-notify-event",
      "onMouseLeave",
      parseCrossingEvent,
      EventPhase.Action,
    );
    this.handlers.bind(
      "color-set",
      "onChange",
      () => {
        return {
          color: this.widget.get_rgba().to_string(),
        };
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

  appendChild(child: TextNode | GjsElement): void {
    if (child.kind === "TEXT_NODE") {
      mountAction(this, child, (shouldOmitMount) => {
        this.children.addChild(child);
      });
      return;
    }

    throw new Error("Button cannot have non-text children.");
  }

  insertBefore(
    child: TextNode | GjsElement,
    beforeChild: TextNode | GjsElement,
  ): void {
    if (child.kind === "TEXT_NODE") {
      mountAction(this, child, (shouldOmitMount) => {
        this.children.insertBefore(child, beforeChild);
      });
      return;
    }

    throw new Error("Button cannot have non-text children.");
  }

  remove(parent: GjsElement): void {
    parent.notifyChildWillUnmount(this);

    this.lifecycle.emitLifecycleEventBeforeDestroy();

    this.widget.destroy();
  }

  render() {
    this.children.update();
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

  notifyChildWillUnmount(child: TextNode | GjsElement) {
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
