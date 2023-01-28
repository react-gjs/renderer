import { DataType } from "dilswer";
import Gdk from "gi://Gdk";
import Gtk from "gi://Gtk";
import { SpinButtonUpdatePolicy } from "../../../g-enums";
import type { GjsContext } from "../../../reconciler/gjs-renderer";
import type { HostContext } from "../../../reconciler/host-context";
import type { GjsElement } from "../../gjs-element";
import type { ElementMargin } from "../../utils/apply-margin";
import { diffProps } from "../../utils/diff-props";
import { ElementLifecycleController } from "../../utils/element-extenders/element-lifecycle-controller";
import type { SyntheticEvent } from "../../utils/element-extenders/event-handlers";
import {
  EventHandlers,
  EventNoop,
} from "../../utils/element-extenders/event-handlers";
import type { DiffedProps } from "../../utils/element-extenders/map-properties";
import { PropertyMapper } from "../../utils/element-extenders/map-properties";
import type { KeyPressEvent } from "../../utils/gdk-events/key-press-event";
import { parseEventKey } from "../../utils/gdk-events/key-press-event";
import type { AlignmentProps } from "../../utils/property-maps-factories/create-alignment-prop-mapper";
import { createAlignmentPropMapper } from "../../utils/property-maps-factories/create-alignment-prop-mapper";
import type { ExpandProps } from "../../utils/property-maps-factories/create-expand-prop-mapper";
import { createExpandPropMapper } from "../../utils/property-maps-factories/create-expand-prop-mapper";
import type { MarginProps } from "../../utils/property-maps-factories/create-margin-prop-mapper";
import { createMarginPropMapper } from "../../utils/property-maps-factories/create-margin-prop-mapper";
import type { StyleProps } from "../../utils/property-maps-factories/create-style-prop-mapper";
import { createStylePropMapper } from "../../utils/property-maps-factories/create-style-prop-mapper";

type NumberInputPropsMixin = AlignmentProps &
  MarginProps &
  ExpandProps &
  StyleProps;

export type NumberInputEvent<P extends Record<string, any> = {}> =
  SyntheticEvent<P, NumberInputElement>;

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
  onKeyPress?: (event: NumberInputEvent<KeyPressEvent>) => void;
  onKeyRelease?: (event: NumberInputEvent<KeyPressEvent>) => void;
}

export class NumberInputElement
  implements GjsElement<"NUMBER_INPUT", Gtk.SpinButton>
{
  static getContext(
    currentContext: HostContext<GjsContext>
  ): HostContext<GjsContext> {
    return currentContext;
  }

  readonly kind = "NUMBER_INPUT";
  widget = new Gtk.SpinButton();
  private parent: GjsElement | null = null;

  readonly lifecycle = new ElementLifecycleController();
  private readonly handlers = new EventHandlers<
    Gtk.SpinButton,
    NumberInputProps
  >(this);

  private isFirstRender = true;
  private readonly propsMapper = new PropertyMapper<NumberInputProps>(
    this.lifecycle,
    createAlignmentPropMapper(this.widget),
    createMarginPropMapper(this.widget),
    createExpandPropMapper(this.widget),
    createStylePropMapper(this.widget),
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
          DataType.Enum(SpinButtonUpdatePolicy),
          (v = SpinButtonUpdatePolicy.ALWAYS) => {
            this.widget.set_update_policy(v);
          }
        )
        .precision(DataType.Int, (v = 0) => {
          this.widget.set_digits(v);
        })
        .max(DataType.Number, (v = Number.MAX_SAFE_INTEGER, allProps) => {
          this.widget.set_range(allProps.min ?? Number.MIN_SAFE_INTEGER, v);
        })
        .min(DataType.Number, (v = Number.MIN_SAFE_INTEGER, allProps) => {
          this.widget.set_range(v, allProps.max ?? Number.MAX_SAFE_INTEGER);
        })
        .increments(DataType.Number, (v = 1, allProps) => {
          this.widget.set_increments(v, allProps.rmbIncrements ?? 1);
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
        })
  );

  constructor(props: DiffedProps) {
    this.handlers.bind("key-press-event", "onKeyPress", (event: Gdk.EventKey) =>
      parseEventKey(event, Gdk.EventType.KEY_PRESS)
    );
    this.handlers.bind(
      "key-release-event",
      "onKeyRelease",
      (event: Gdk.EventKey) => parseEventKey(event, Gdk.EventType.KEY_RELEASE)
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
    parent.notifyWillUnmount(this);

    this.lifecycle.emitLifecycleEventBeforeDestroy();

    this.widget.destroy();
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

  notifyWillUnmount() {}

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
