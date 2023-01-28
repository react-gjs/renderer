import { DataType } from "dilswer";
import Gtk from "gi://Gtk";
import type { PositionType } from "../../../g-enums";
import { ButtonType } from "../../../g-enums";
import { EventPhase } from "../../../reconciler/event-phase";
import type { GjsContext } from "../../../reconciler/gjs-renderer";
import type { HostContext } from "../../../reconciler/host-context";
import type { GjsElement } from "../../gjs-element";
import type { ElementMargin } from "../../utils/apply-margin";
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
import type { StyleProps } from "../../utils/property-maps-factories/create-style-prop-mapper";
import { createStylePropMapper } from "../../utils/property-maps-factories/create-style-prop-mapper";
import type { TextNode } from "../markup/text-node";

type ButtonPropsMixin = AlignmentProps & MarginProps & ExpandProps & StyleProps;

export type ButtonEvent<P extends Record<string, any> = {}> = SyntheticEvent<
  P,
  ButtonElement
>;

export interface ButtonProps extends ButtonPropsMixin {
  type?: ButtonType;
  label?: string;
  image?: Gtk.Widget;
  imagePosition?: PositionType;
  useUnderline?: boolean;
  margin?: ElementMargin;
  focusOnClick?: boolean;
  alwaysShowImage?: boolean;
  onClick?: (event: ButtonEvent) => void;
  onActivate?: (event: ButtonEvent) => void;
  onPressed?: (event: ButtonEvent) => void;
  onReleased?: (event: ButtonEvent) => void;
  onMouseEnter?: (event: ButtonEvent<PointerEvent>) => void;
  onMouseLeave?: (event: ButtonEvent<PointerEvent>) => void;
}

const WidgetDataType = DataType.Custom(
  (v: any): v is Gtk.Widget => typeof v === "object"
);

export class ButtonElement implements GjsElement<"BUTTON", Gtk.Button> {
  static getContext(
    currentContext: HostContext<GjsContext>
  ): HostContext<GjsContext> {
    return currentContext.set({
      isInTextContext: true,
    });
  }

  readonly kind = "BUTTON";
  widget = new Gtk.Button();

  private parent: GjsElement | null = null;

  readonly lifecycle = new ElementLifecycleController();
  private readonly handlers = new EventHandlers<Gtk.Button, ButtonProps>(this);
  private readonly propsMapper = new PropertyMapper<ButtonProps>(
    this.lifecycle,
    createAlignmentPropMapper(this.widget),
    createMarginPropMapper(this.widget),
    createExpandPropMapper(this.widget),
    createStylePropMapper(this.widget),
    (props) =>
      props
        .label(DataType.String, (v) => {
          this.widget.label = v ?? null;
        })
        .alwaysShowImage(DataType.Boolean, (v = false) => {
          this.widget.always_show_image = v;
        })
        .image(WidgetDataType, (v) => {
          this.widget.set_image(v ?? null);
        })
        .imagePosition(
          DataType.Enum(Gtk.PositionType),
          (v = Gtk.PositionType.LEFT) => {
            this.widget.image_position = v;
          }
        )
        .useUnderline(DataType.Boolean, (v = false) => {
          this.widget.use_underline = v;
        })
        .type(DataType.Enum(ButtonType), (v = ButtonType.NORMAL) => {
          switch (v) {
            case ButtonType.NORMAL:
              this.widget.relief = Gtk.ReliefStyle.NORMAL;
              break;
            case ButtonType.FLAT:
              this.widget.relief = Gtk.ReliefStyle.NONE;
              break;
          }
        })
        .focusOnClick(DataType.Boolean, (v = true) => {
          this.widget.focus_on_click = v;
        })
  );

  private readonly children = new TextChildController(
    this.lifecycle,
    (text) => {
      this.widget.label = text;
    }
  );

  constructor(props: DiffedProps) {
    this.handlers.bind("clicked", "onClick");
    this.handlers.bind("activate", "onActivate");
    this.handlers.bind("pressed", "onPressed");
    this.handlers.bind("released", "onReleased");
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

    this.updateProps(props);

    this.lifecycle.emitLifecycleEventAfterCreate();
  }

  updateProps(props: DiffedProps): void {
    this.lifecycle.emitLifecycleEventUpdate(props);
  }

  // #region This widget direct mutations

  appendChild(child: TextNode | GjsElement): void {
    if (child.kind === "TEXT_NODE") {
      child.notifyWillAppendTo(this);
      this.children.addChild(child);
      this.widget.show_all();
      return;
    }

    throw new Error("Button cannot have non-text children.");
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

    throw new Error("Button cannot have non-text children.");
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
    this.parent = parent;
    return true;
  }

  notifyWillUnmount(child: TextNode | GjsElement) {
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
