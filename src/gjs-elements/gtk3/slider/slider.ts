import { DataType } from "dilswer";
import Gtk from "gi://Gtk";
import type { Orientation, SensitivityType } from "../../../enums/gtk3-index";
import { PositionType } from "../../../enums/gtk3-index";
import type { GjsContext } from "../../../reconciler/gjs-renderer";
import type { HostContext } from "../../../reconciler/host-context";
import { BaseElement, type GjsElement } from "../../gjs-element";
import { compareRecordsShallow, diffProps } from "../../utils/diff-props";
import { ElementLifecycleController } from "../../utils/element-extenders/element-lifecycle-controller";
import type { SyntheticEvent } from "../../utils/element-extenders/event-handlers";
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
import type { TooltipProps } from "../../utils/property-maps-factories/create-tooltip-prop-mapper";
import { createTooltipPropMapper } from "../../utils/property-maps-factories/create-tooltip-prop-mapper";

type SliderPropsMixin =
  & ChildPropertiesProps
  & SizeRequestProps
  & AlignmentProps
  & MarginProps
  & ExpandProps
  & StyleProps
  & TooltipProps;

export type SliderEvent<P extends Record<string, any> = {}> = SyntheticEvent<P, SliderElement>;

export interface SliderProps extends SliderPropsMixin {
  orientation?: Orientation;
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  showValue?: boolean;
  showDigits?: number;
  precision?: number;
  /**
   * A number between `0` to `1`, representing the fill level of the
   * slider.
   */
  fillLevel?: number;
  showFillLevel?: boolean;
  restrictToFillLevel?: boolean;
  flip?: boolean;
  invert?: boolean;
  stepSensitivity?: SensitivityType;
  fixedSize?: boolean;
  marks?: { [key: number]: string };
  marksPosition?: PositionType;
  onValueChange?: (event: SliderEvent<{ value: number }>) => void;
}

export class SliderElement extends BaseElement implements GjsElement<"SLIDER", Gtk.Scale> {
  static getContext(
    currentContext: HostContext<GjsContext>,
  ): HostContext<GjsContext> {
    return currentContext;
  }

  readonly kind = "SLIDER";
  protected widget = new Gtk.Scale();

  protected parent: GjsElement | null = null;
  protected adjustment = new Gtk.Adjustment();

  readonly lifecycle = new ElementLifecycleController();
  protected readonly handlers = new EventHandlers<
    Gtk.Scale,
    SliderProps
  >(this);
  protected readonly propsMapper = new PropertyMapper<SliderProps>(
    this.lifecycle,
    createSizeRequestPropMapper(this.widget),
    createAlignmentPropMapper(this.widget, {
      h: Gtk.Align.FILL,
      v: Gtk.Align.FILL,
    }),
    createMarginPropMapper(this.widget),
    createExpandPropMapper(this.widget),
    createStylePropMapper(this.widget),
    createTooltipPropMapper(this.widget),
    createChildPropsMapper(
      () => this.widget,
      () => this.parent,
    ),
    (props) =>
      props
        .max(DataType.Number, (v = 100, allProps) => {
          this.adjustment.set_upper(v);

          if (allProps.fillLevel) {
            this.updateFillLevel(allProps.fillLevel);
          }
        })
        .min(DataType.Number, (v = 0, allProps) => {
          this.adjustment.set_lower(v);

          if (allProps.fillLevel) {
            this.updateFillLevel(allProps.fillLevel);
          }
        })
        .step(DataType.Number, (v = 1) => {
          this.adjustment.set_page_increment(v);
        })
        .value(DataType.Number, (v = 0) => {
          this.adjustment.set_value(v);
        })
        .orientation(
          DataType.Enum(Gtk.Orientation),
          (v = Gtk.Orientation.HORIZONTAL) => {
            this.widget.set_orientation(v);
          },
        )
        .showValue(DataType.Boolean, (v = true) => {
          this.widget.set_draw_value(v);
        })
        .showDigits(DataType.Number, (v = 0) => {
          this.widget.set_digits(v);
        })
        .precision(DataType.Number, (v = 0) => {
          this.widget.set_round_digits(v);
        })
        .fillLevel(DataType.Number, (v = 0) => {
          this.updateFillLevel(v);
        })
        .showFillLevel(DataType.Boolean, (v = false) => {
          this.widget.set_show_fill_level(v);
        })
        .restrictToFillLevel(DataType.Boolean, (v = false) => {
          this.widget.set_restrict_to_fill_level(v);
        })
        .flip(DataType.Boolean, (v = false) => {
          this.widget.set_flippable(v);
        })
        .invert(DataType.Boolean, (v = false) => {
          this.widget.set_inverted(v);
        })
        .stepSensitivity(
          DataType.Enum(Gtk.SensitivityType),
          (v = Gtk.SensitivityType.AUTO) => {
            this.widget.set_upper_stepper_sensitivity(v);
            this.widget.set_lower_stepper_sensitivity(v);
          },
        )
        .fixedSize(DataType.Boolean, (v = false) => {
          this.widget.set_slider_size_fixed(v);
        })
        .marks(DataType.Dict(DataType.String), (v = {}, allProps) => {
          const position = (allProps.marksPosition as any as Gtk.PositionType)
            ?? PositionType.TOP;

          this.widget.clear_marks();
          for (const [key, value] of Object.entries(v)) {
            this.widget.add_mark(Number(key), position, value);
          }
        })
        .marksPosition(
          DataType.Enum(PositionType),
          (_, __, { instead }) => {
            instead("marks");
          },
        ),
  );

  constructor(props: DiffedProps) {
    super();
    this.widget.set_adjustment(this.adjustment);
    this.adjustment.set_page_size(0);

    this.handlers.bind("value-changed", "onValueChange", () => ({
      value: this.adjustment.value,
    }));

    this.updateProps(props);

    this.lifecycle.emitLifecycleEventAfterCreate();
  }

  protected updateFillLevel(v: number) {
    const min = this.adjustment.get_lower();
    const max = this.adjustment.get_upper();

    const acceptableRange = max - min;

    const fillAmount = Math.max(
      min,
      Math.min(max, min + v * acceptableRange),
    );

    this.widget.set_fill_level(fillAmount);
  }

  updateProps(props: DiffedProps): void {
    this.lifecycle.emitLifecycleEventUpdate(props);
  }

  // #region This widget direct mutations

  appendChild(): void {
    throw new Error("Slider cannot have children.");
  }

  insertBefore(): void {
    throw new Error("Slider cannot have children.");
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
      SliderElement.SliderDiffers,
    );
  }

  // #endregion
}
