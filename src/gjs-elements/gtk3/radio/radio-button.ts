import { DataType } from "dilswer";
import Gtk from "gi://Gtk";
import { EventPhase } from "../../../reconciler/event-phase";
import type { GjsContext } from "../../../reconciler/gjs-renderer";
import type { HostContext } from "../../../reconciler/host-context";
import { BaseElement, type GjsElement } from "../../gjs-element";
import { GjsElementManager } from "../../gjs-element-manager";
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
import { RadioGroupElement } from "./radio-group";

type RadioButtonPropsMixin =
  & ChildPropertiesProps
  & SizeRequestProps
  & AlignmentProps
  & MarginProps
  & ExpandProps
  & StyleProps
  & TooltipProps
  & AccelProps;

export type RadioButtonEvent<P extends Record<string, any> = {}> = SyntheticEvent<P, RadioButtonElement>;

export interface RadioButtonProps extends RadioButtonPropsMixin {
  label?: string;
  useUnderline?: boolean;
  onChange?: (event: RadioButtonEvent<{ isActive: boolean }>) => void;
  onClick?: (event: RadioButtonEvent) => void;
  onActivate?: (event: RadioButtonEvent) => void;
  onPressed?: (event: RadioButtonEvent) => void;
  onReleased?: (event: RadioButtonEvent) => void;
  onMouseEnter?: (event: RadioButtonEvent<PointerData>) => void;
  onMouseLeave?: (event: RadioButtonEvent<PointerData>) => void;
}

export class RadioButtonElement extends BaseElement implements GjsElement<"RADIO_BUTTON", Gtk.RadioButton> {
  static getContext(
    currentContext: HostContext<GjsContext>,
  ): HostContext<GjsContext> {
    return currentContext.set({
      isInTextContext: true,
    });
  }

  readonly kind = "RADIO_BUTTON";

  protected widget = new Gtk.RadioButton();

  protected parent: GjsElement | null = null;

  readonly lifecycle = new ElementLifecycleController();
  declare protected handlers: EventHandlers<
    Gtk.RadioButton,
    RadioButtonProps
  >;
  protected readonly propsMapper = new PropertyMapper<RadioButtonProps>(this.lifecycle);

  protected readonly children = new TextChildController(
    this.lifecycle,
    (text) => {
      this.widget.label = text;
    },
  );

  protected isInitialized = false;
  protected unappliedProps: DiffedProps = [];

  constructor(props: DiffedProps) {
    super();
    this.updateProps(props);

    this.lifecycle.emitLifecycleEventAfterCreate();
  }

  updateProps(props: DiffedProps): void {
    if (this.isInitialized) {
      this.lifecycle.emitLifecycleEventUpdate(props);
    } else {
      for (const prop of props) {
        this.unappliedProps = this.unappliedProps.filter(
          ([name]) => name !== prop[0],
        );
        this.unappliedProps.push(prop);
      }
    }
  }

  // #region This widget direct mutations

  appendChild(child: TextNode | GjsElement): void {
    if (child.kind === "TEXT_NODE") {
      mountAction(this, child, (shouldOmitMount) => {
        this.children.addChild(child);
      });
      return;
    }

    throw new Error("RadioButton cannot have non-text children.");
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

    throw new Error("RadioButton cannot have non-text children.");
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
    if (
      GjsElementManager.isGjsElementOfKind(parent, RadioGroupElement)
    ) {
      this.parent = parent;

      const widget = (this.widget = Gtk.RadioButton.new_from_widget(
        parent.radioGroup,
      ));

      this.isInitialized = true;

      this.propsMapper.addCases(
        createSizeRequestPropMapper(widget),
        createAlignmentPropMapper(widget),
        createMarginPropMapper(widget),
        createExpandPropMapper(widget),
        createStylePropMapper(widget),
        createTooltipPropMapper(widget),
        createAccelPropMapper(widget),
        createChildPropsMapper(
          () => this.widget,
          () => this.parent,
        ),
        (props) =>
          props
            .label(DataType.String, (v = "") => {
              widget.set_label(v);
            })
            .useUnderline(DataType.Boolean, (v = false) => {
              this.widget.use_underline = v;
            }),
      );

      this.handlers = new EventHandlers<
        Gtk.RadioButton,
        RadioButtonProps
      >(this);

      this.handlers.bind("clicked", "onClick");
      this.handlers.bind("activate", "onActivate");
      this.handlers.bind("pressed", "onPressed");
      this.handlers.bind("released", "onReleased");
      this.handlers.bind("toggled", "onChange", () => {
        return {
          isActive: this.widget.active,
        };
      });
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

      this.lifecycle.emitLifecycleEventUpdate(this.unappliedProps);
      this.unappliedProps = [];
      this.children.update();
    } else {
      throw new Error("RadioButton can be only child of RadioBox.");
    }
    return true;
  }

  notifyMounted(): void {
    this.lifecycle.emitMountedEvent();
  }

  notifyChildWillUnmount(child: GjsElement | TextNode) {
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
