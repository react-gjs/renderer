import { DataType } from "dilswer";
import Gdk from "gi://Gdk";
import Gtk from "gi://Gtk";
import type { SpinButtonUpdatePolicy } from "../../../enums/gtk3-index";
import type { GjsContext } from "../../../reconciler/gjs-renderer";
import type { HostContext } from "../../../reconciler/host-context";
import { BaseElement, type GjsElement } from "../../gjs-element";
import type { ElementMargin } from "../../utils/apply-margin";
import { ElementLifecycleController } from "../../utils/element-extenders/element-lifecycle-controller";
import type { SyntheticEvent } from "../../utils/element-extenders/event-handlers";
import { EventHandlers, EventNoop } from "../../utils/element-extenders/event-handlers";
import type { DiffedProps } from "../../utils/element-extenders/map-properties";
import { PropertyMapper } from "../../utils/element-extenders/map-properties";
import { parseEventKey } from "../../utils/gdk-events/key-press-event";
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

type NumberInputPropsMixin =
  & ChildPropertiesProps
  & SizeRequestProps
  & AlignmentProps
  & MarginProps
  & ExpandProps
  & StyleProps
  & TooltipProps;

export type NumberInputEvent<P extends Record<string, any> = {}> = SyntheticEvent<P, NumberInputElement>;

export interface NumberInputProps extends NumberInputPropsMixin {
  defaultValue?: number;
  increments?: number;
  rmbIncrements?: number;
  margin?: ElementMargin;
  max?: number;
  min?: number;
  numericOnly?: boolean;
  precision?: number;
  snapToTicks?: boolean;
  updatePolicy?: SpinButtonUpdatePolicy;
  value?: number;
  wrapOnBounds?: boolean;
  onChange?: (event: NumberInputEvent<{ value: number }>) => void;
  onKeyPress?: (
    event: NumberInputEvent<Rg.KeyPressEventData>,
  ) => void;
  onKeyRelease?: (
    event: NumberInputEvent<Rg.KeyPressEventData>,
  ) => void;
}

export class NumberInputElement extends BaseElement implements GjsElement<"NUMBER_INPUT", Gtk.SpinButton> {
  static getContext(
    currentContext: HostContext<GjsContext>,
  ): HostContext<GjsContext> {
    return currentContext;
  }

  readonly kind = "NUMBER_INPUT";
  protected widget = new Gtk.SpinButton();
  protected parent: GjsElement | null = null;

  readonly lifecycle = new ElementLifecycleController();
  protected readonly handlers = new EventHandlers<
    Gtk.SpinButton,
    NumberInputProps
  >(this);

  protected isFirstRender = true;
  protected readonly propsMapper = new PropertyMapper<NumberInputProps>(
    this.lifecycle,
    createSizeRequestPropMapper(this.widget),
    createAlignmentPropMapper(this.widget),
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
        .value(DataType.Number, (v, allProps) => {
          const defaultValue = allProps.defaultValue ?? 0;
          const newValue = v ?? defaultValue;
          if (newValue != null) {
            if (this.isFirstRender) {
              this.isFirstRender = false;
              const timeout = setTimeout(() => {
                this.widget.set_value(newValue);
              }, 0);
              return () => clearTimeout(timeout);
            } else {
              this.widget.set_value(newValue);
            }
          }
        })
        .updatePolicy(
          DataType.Enum(Gtk.SpinButtonUpdatePolicy),
          (v = Gtk.SpinButtonUpdatePolicy.ALWAYS) => {
            this.widget.set_update_policy(v);
          },
        )
        .precision(DataType.Int, (v = 0) => {
          this.widget.set_digits(v);
        })
        .max(
          DataType.Number,
          (v = Number.MAX_SAFE_INTEGER, allProps) => {
            this.widget.set_range(
              allProps.min ?? Number.MIN_SAFE_INTEGER,
              v,
            );
          },
        )
        .min(
          DataType.Number,
          (v = Number.MIN_SAFE_INTEGER, allProps) => {
            this.widget.set_range(
              v,
              allProps.max ?? Number.MAX_SAFE_INTEGER,
            );
          },
        )
        .increments(DataType.Number, (v = 1, allProps) => {
          this.widget.set_increments(
            v,
            allProps.rmbIncrements ?? 1,
          );
        })
        .rmbIncrements(DataType.Number, (v = 1, allProps) => {
          this.widget.set_increments(allProps.increments ?? 1, v);
        })
        .numericOnly(DataType.Boolean, (v = true) => {
          this.widget.set_numeric(v);
        })
        .snapToTicks(DataType.Boolean, (v = false) => {
          this.widget.set_snap_to_ticks(v);
        })
        .wrapOnBounds(DataType.Boolean, (v = false) => {
          this.widget.set_wrap(v);
        }),
  );

  constructor(props: DiffedProps) {
    super();
    this.handlers.bind(
      "key-press-event",
      "onKeyPress",
      (event: Gdk.Event & Gdk.EventKey) => parseEventKey(event, Gdk.EventType.KEY_PRESS),
    );
    this.handlers.bind(
      "key-release-event",
      "onKeyRelease",
      (event: Gdk.Event & Gdk.EventKey) => parseEventKey(event, Gdk.EventType.KEY_RELEASE),
    );

    let previousValue = 0;
    this.handlers.bind("value-changed", "onChange", () => {
      const newValue = this.widget.value;

      if (newValue === previousValue) {
        throw new EventNoop();
      }

      previousValue = newValue;

      return {
        value: this.widget.value,
      };
    });

    this.updateProps(props);

    this.lifecycle.emitLifecycleEventAfterCreate();
  }

  updateProps(props: DiffedProps): void {
    this.lifecycle.emitLifecycleEventUpdate(props);
  }

  // #region This widget direct mutations

  appendChild(): void {
    throw new Error("Text Entry cannot have children.");
  }

  insertBefore(): void {
    throw new Error("TextEntry does not support children.");
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

  // #endregion
}
