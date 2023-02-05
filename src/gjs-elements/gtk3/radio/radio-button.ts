import { DataType } from "dilswer";
import Gtk from "gi://Gtk";
import { EventPhase } from "../../../reconciler/event-phase";
import type { GjsContext } from "../../../reconciler/gjs-renderer";
import type { HostContext } from "../../../reconciler/host-context";
import type { GjsElement } from "../../gjs-element";
import { GjsElementManager } from "../../gjs-element-manager";
import { diffProps } from "../../utils/diff-props";
import { ElementLifecycleController } from "../../utils/element-extenders/element-lifecycle-controller";
import type { SyntheticEvent } from "../../utils/element-extenders/event-handlers";
import { EventHandlers } from "../../utils/element-extenders/event-handlers";
import type { DiffedProps } from "../../utils/element-extenders/map-properties";
import { PropertyMapper } from "../../utils/element-extenders/map-properties";
import { TextChildController } from "../../utils/element-extenders/text-child-controller";
import { parseCrossingEvent } from "../../utils/gdk-events/pointer-event";
import type { AlignmentProps } from "../../utils/property-maps-factories/create-alignment-prop-mapper";
import { createAlignmentPropMapper } from "../../utils/property-maps-factories/create-alignment-prop-mapper";
import type { ExpandProps } from "../../utils/property-maps-factories/create-expand-prop-mapper";
import { createExpandPropMapper } from "../../utils/property-maps-factories/create-expand-prop-mapper";
import type { MarginProps } from "../../utils/property-maps-factories/create-margin-prop-mapper";
import { createMarginPropMapper } from "../../utils/property-maps-factories/create-margin-prop-mapper";
import type { SizeRequestProps } from "../../utils/property-maps-factories/create-size-request-prop-mapper";
import { createSizeRequestPropMapper } from "../../utils/property-maps-factories/create-size-request-prop-mapper";
import type { StyleProps } from "../../utils/property-maps-factories/create-style-prop-mapper";
import { createStylePropMapper } from "../../utils/property-maps-factories/create-style-prop-mapper";
import type { TextNode } from "../markup/text-node";
import { RadioBoxElement } from "./radio-box";

type RadioButtonPropsMixin = SizeRequestProps &
  AlignmentProps &
  MarginProps &
  ExpandProps &
  StyleProps;

export type RadioButtonEvent<P extends Record<string, any> = {}> =
  SyntheticEvent<P, RadioButtonElement>;

export interface RadioButtonProps extends RadioButtonPropsMixin {
  label?: string;
  useUnderline?: boolean;
  onChange?: (event: RadioButtonEvent<{ isActive: boolean }>) => void;
  onClick?: (event: RadioButtonEvent) => void;
  onActivate?: (event: RadioButtonEvent) => void;
  onPressed?: (event: RadioButtonEvent) => void;
  onReleased?: (event: RadioButtonEvent) => void;
  onMouseEnter?: (event: RadioButtonEvent<PointerEvent>) => void;
  onMouseLeave?: (event: RadioButtonEvent<PointerEvent>) => void;
}

export class RadioButtonElement
  implements GjsElement<"RADIO_BUTTON", Gtk.RadioButton>
{
  static getContext(
    currentContext: HostContext<GjsContext>
  ): HostContext<GjsContext> {
    return currentContext.set({
      isInTextContext: true,
    });
  }

  readonly kind = "RADIO_BUTTON";

  widget = new Gtk.RadioButton();

  private parent: GjsElement | null = null;

  readonly lifecycle = new ElementLifecycleController();
  private handlers!: EventHandlers<Gtk.RadioButton, RadioButtonProps>;
  private readonly propsMapper = new PropertyMapper<RadioButtonProps>(
    this.lifecycle
  );

  private readonly children = new TextChildController(
    this.lifecycle,
    (text) => {
      this.widget.label = text;
    }
  );

  private isInitialized = false;
  private unappliedProps: DiffedProps = [];

  constructor(props: DiffedProps) {
    this.updateProps(props);

    this.lifecycle.emitLifecycleEventAfterCreate();
  }

  updateProps(props: DiffedProps): void {
    if (this.isInitialized) {
      this.lifecycle.emitLifecycleEventUpdate(props);
    } else {
      for (const prop of props) {
        this.unappliedProps = this.unappliedProps.filter(
          ([name]) => name !== prop[0]
        );
        this.unappliedProps.push(prop);
      }
    }
  }

  // #region This widget direct mutations

  appendChild(child: TextNode | GjsElement): void {
    if (child.kind === "TEXT_NODE") {
      child.notifyWillAppendTo(this);
      this.children.addChild(child);
      this.widget.show_all();
      return;
    }

    throw new Error("RadioButton cannot have non-text children.");
  }

  insertBefore(
    child: TextNode | GjsElement,
    beforeChild: TextNode | GjsElement
  ): void {
    if (child.kind === "TEXT_NODE") {
      child.notifyWillAppendTo(this);
      this.children.insertBefore(child, beforeChild);
      this.widget.show_all();
      return;
    }

    throw new Error("RadioButton cannot have non-text children.");
  }

  remove(parent: GjsElement): void {
    parent.notifyWillUnmount(this);

    this.lifecycle.emitLifecycleEventBeforeDestroy();

    this.widget.destroy();
  }

  render() {
    this.children.update();
    this.parent?.widget.show_all();
  }

  // #endregion

  // #region Element internal signals

  notifyWillAppendTo(parent: GjsElement): boolean {
    if (GjsElementManager.isGjsElementOfKind(parent, RadioBoxElement)) {
      this.parent = parent;

      const widget = (this.widget = Gtk.RadioButton.new_from_widget(
        parent.radioGroup
      ));

      this.isInitialized = true;

      this.propsMapper.addCases(
        createSizeRequestPropMapper(this.widget),
        createAlignmentPropMapper(widget),
        createMarginPropMapper(widget),
        createExpandPropMapper(widget),
        createStylePropMapper(widget),
        (props) =>
          props
            .label(DataType.String, (v = "") => {
              widget.set_label(v);
            })
            .useUnderline(DataType.Boolean, (v = false) => {
              this.widget.use_underline = v;
            })
      );

      this.handlers = new EventHandlers<Gtk.RadioButton, RadioButtonProps>(
        this
      );

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
        EventPhase.Action
      );
      this.handlers.bind(
        "leave-notify-event",
        "onMouseLeave",
        parseCrossingEvent,
        EventPhase.Action
      );

      this.lifecycle.emitLifecycleEventUpdate(this.unappliedProps);
      this.unappliedProps = [];
      this.children.update();
    } else {
      throw new Error("RadioButton can be only child of RadioBox.");
    }
    return true;
  }

  notifyWillUnmount(child: GjsElement | TextNode) {
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

  diffProps(
    oldProps: Record<string, any>,
    newProps: Record<string, any>
  ): DiffedProps {
    return diffProps(oldProps, newProps, true);
  }

  // #endregion
}
