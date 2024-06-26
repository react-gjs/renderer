import { DataType } from "dilswer";
import Gtk from "gi://Gtk";
import { ButtonType } from "../../../enums/custom";
import type { SensitivityType } from "../../../enums/gtk3-index";
import { PositionType } from "../../../enums/gtk3-index";
import { EventPhase } from "../../../reconciler/event-phase";
import type { GjsContext } from "../../../reconciler/gjs-renderer";
import type { HostContext } from "../../../reconciler/host-context";
import { BaseElement, type GjsElement } from "../../gjs-element";
import type { ElementMargin } from "../../utils/apply-margin";
import { compareRecordsShallow, diffProps } from "../../utils/diff-props";
import { ElementLifecycleController } from "../../utils/element-extenders/element-lifecycle-controller";
import type { SyntheticEvent } from "../../utils/element-extenders/event-handlers";
import { EventHandlers } from "../../utils/element-extenders/event-handlers";
import type { DiffedProps } from "../../utils/element-extenders/map-properties";
import { PropertyMapper } from "../../utils/element-extenders/map-properties";
import { TextChildController } from "../../utils/element-extenders/text-child-controller";
import type { PointerData } from "../../utils/gdk-events/pointer-event";
import { parseCrossingEvent } from "../../utils/gdk-events/pointer-event";
import { mountAction } from "../../utils/mount-action";
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

type VolumeButtonPropsMixin =
  & ChildPropertiesProps
  & SizeRequestProps
  & AlignmentProps
  & MarginProps
  & ExpandProps
  & StyleProps
  & TooltipProps
  & AccelProps;

export type VolumeButtonEvent<P extends Record<string, any> = {}> = SyntheticEvent<P, VolumeButtonElement>;

export interface VolumeButtonProps extends VolumeButtonPropsMixin {
  type?: ButtonType;
  useUnderline?: boolean;
  margin?: ElementMargin;
  focusOnClick?: boolean;
  value?: number;
  step?: number;
  precision?: number;
  flip?: boolean;
  invert?: boolean;
  stepSensitivity?: SensitivityType;
  fixedSize?: boolean;
  marks?: { [key: number]: string };
  marksPosition?: PositionType;
  onClick?: (event: VolumeButtonEvent) => void;
  onActivate?: (event: VolumeButtonEvent) => void;
  onPressed?: (event: VolumeButtonEvent) => void;
  onReleased?: (event: VolumeButtonEvent) => void;
  onMouseEnter?: (event: VolumeButtonEvent<PointerData>) => void;
  onMouseLeave?: (event: VolumeButtonEvent<PointerData>) => void;
  onPopupOpen?: (event: VolumeButtonEvent) => void;
  onPopupClose?: (event: VolumeButtonEvent) => void;
  onValueChange?: (
    event: VolumeButtonEvent<{ value: number }>,
  ) => void;
}

export class VolumeButtonElement extends BaseElement implements GjsElement<"VOLUME_BUTTON", Gtk.VolumeButton> {
  static getContext(
    currentContext: HostContext<GjsContext>,
  ): HostContext<GjsContext> {
    return currentContext.set({
      isInTextContext: true,
    });
  }

  readonly kind = "VOLUME_BUTTON";
  protected widget = new Gtk.VolumeButton();

  protected parent: GjsElement | null = null;
  protected adjustment = this.widget.get_adjustment();

  readonly lifecycle = new ElementLifecycleController();
  protected readonly handlers = new EventHandlers<
    Gtk.VolumeButton,
    VolumeButtonProps
  >(this);
  protected readonly propsMapper = new PropertyMapper<VolumeButtonProps>(
    this.lifecycle,
    createSizeRequestPropMapper(this.widget),
    createAlignmentPropMapper(this.widget),
    createMarginPropMapper(this.widget),
    createExpandPropMapper(this.widget),
    createStylePropMapper(this.widget),
    createTooltipPropMapper(this.widget),
    createAccelPropMapper(this.widget),
    createChildPropsMapper(
      () => this.widget,
      () => this.parent,
    ),
    (props) =>
      props
        .step(DataType.Number, (v = 0.02) => {
          this.adjustment!.set_page_increment(v);
        })
        .value(DataType.Number, (v = 0) => {
          this.adjustment!.set_value(v);
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
        .precision(DataType.Number, (v = 2) => {
          this.scale.set_round_digits(v);
        })
        .flip(DataType.Boolean, (v = false) => {
          this.scale.set_flippable(v);
        })
        .invert(DataType.Boolean, (v = true) => {
          this.scale.set_inverted(v);
        })
        .stepSensitivity(
          DataType.Enum(Gtk.SensitivityType),
          (v = Gtk.SensitivityType.AUTO) => {
            const scale = this.scale;
            scale.set_upper_stepper_sensitivity(v);
            scale.set_lower_stepper_sensitivity(v);
          },
        )
        .fixedSize(DataType.Boolean, (v = false) => {
          this.scale.set_slider_size_fixed(v);
        })
        .marks(
          DataType.Dict(DataType.String),
          (v = {}, allProps) => {
            const position = (allProps.marksPosition as any as Gtk.PositionType)
              ?? PositionType.TOP;

            this.scale.clear_marks();
            for (const [key, value] of Object.entries(v)) {
              this.scale.add_mark(Number(key), position, value);
            }
          },
        )
        .marksPosition(
          DataType.Enum(PositionType),
          (_, __, { instead }) => {
            instead("marks");
          },
        ),
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
      "popup",
      "onPopupOpen",
      undefined,
      EventPhase.Action,
    );
    this.handlers.bind(
      "popdown",
      "onPopupClose",
      undefined,
      EventPhase.Action,
    );
    this.handlers.bind("value-changed", "onValueChange", () => ({
      value: this.adjustment!.value,
    }));

    this.updateProps(props);

    this.lifecycle.emitLifecycleEventAfterCreate();
  }

  protected get scale(): Gtk.Scale {
    const popover = this.widget.get_popup() as Gtk.Bin;
    const box = popover.get_child() as Gtk.Box;

    const scale = box.get_children()![1];

    return scale as Gtk.Scale;
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

  static SliderDiffers = new Map<
    string,
    (oldProp: any, newProp: any) => boolean
  >([["marks", compareRecordsShallow]]);

  diffProps(
    oldProps: Record<string, any>,
    newProps: Record<string, any>,
  ): DiffedProps {
    return diffProps(
      oldProps,
      newProps,
      true,
      VolumeButtonElement.SliderDiffers,
    );
  }

  // #endregion
}
