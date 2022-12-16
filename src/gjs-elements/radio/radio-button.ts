import { DataType } from "dilswer";
import Gtk from "gi://Gtk";
import { EventPhase } from "../../reconciler/event-phase";
import type { GjsContext } from "../../reconciler/gjs-renderer";
import type { HostContext } from "../../reconciler/host-context";
import type { GjsElement } from "../gjs-element";
import { GjsElementManager } from "../gjs-element-manager";
import type { TextNode } from "../markup/text-node";
import { diffProps } from "../utils/diff-props";
import { ElementLifecycleController } from "../utils/element-extenders/element-lifecycle-controller";
import type { SyntheticEvent } from "../utils/element-extenders/event-handlers";
import { EventHandlers } from "../utils/element-extenders/event-handlers";
import type { DiffedProps } from "../utils/element-extenders/map-properties";
import { PropertyMapper } from "../utils/element-extenders/map-properties";
import { TextChildController } from "../utils/element-extenders/text-child-controller";
import { parseCrossingEvent } from "../utils/gdk-events/pointer-event";
import type { AlignmentProps } from "../utils/property-maps-factories/create-alignment-prop-mapper";
import { createAlignmentPropMapper } from "../utils/property-maps-factories/create-alignment-prop-mapper";
import type { MarginProps } from "../utils/property-maps-factories/create-margin-prop-mapper";
import { createMarginPropMapper } from "../utils/property-maps-factories/create-margin-prop-mapper";
import type { StyleProps } from "../utils/property-maps-factories/create-style-prop-mapper";
import { createStylePropMapper } from "../utils/property-maps-factories/create-style-prop-mapper";
import { RadioBoxElement } from "./radio-box";

type RadioButtonPropsMixin = AlignmentProps & MarginProps & StyleProps;

export interface RadioButtonProps extends RadioButtonPropsMixin {
  label?: string;
  useUnderline?: boolean;
  onChange?: (event: SyntheticEvent<{ isActive: boolean }>) => void;
  onClick?: (event: SyntheticEvent) => void;
  onActivate?: (event: SyntheticEvent) => void;
  onPressed?: (event: SyntheticEvent) => void;
  onReleased?: (event: SyntheticEvent) => void;
  onMouseEnter?: (event: SyntheticEvent<PointerEvent>) => void;
  onMouseLeave?: (event: SyntheticEvent<PointerEvent>) => void;
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
  private w?: Gtk.RadioButton;
  get widget(): Gtk.RadioButton {
    if (!this.w) {
      throw new Error("Widget does not exist.");
    }
    return this.w;
  }

  private parent: GjsElement | null = null;

  private readonly lifecycle = new ElementLifecycleController();
  private readonly handlers = new EventHandlers<
    Gtk.RadioButton,
    RadioButtonProps
  >(this.lifecycle, this.widget);
  private readonly propsMapper = new PropertyMapper<RadioButtonProps>(
    this.lifecycle
  );

  private readonly children = new TextChildController(
    this.lifecycle,
    (text) => {
      this.widget.label = text;
    }
  );

  private unappliedProps: DiffedProps = [];

  constructor(props: DiffedProps) {
    this.updateProps(props);

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

    this.lifecycle.emitLifecycleEventAfterCreate();
  }

  updateProps(props: DiffedProps): void {
    if (this.w) {
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

  notifyWillAppendTo(parent: GjsElement): void {
    if (GjsElementManager.isGjsElementOfKind(parent, RadioBoxElement)) {
      this.parent = parent;

      const widget = (this.w = Gtk.RadioButton.new_from_widget(
        parent.radioGroup
      ));

      this.propsMapper.addCases(
        createAlignmentPropMapper(widget),
        createMarginPropMapper(widget),
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

      this.lifecycle.emitLifecycleEventUpdate(this.unappliedProps);
      this.unappliedProps = [];
    } else {
      throw new Error("RadioButton can be only child of RadioBox.");
    }
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
