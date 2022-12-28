import { DataType } from "dilswer";
import Gtk from "gi://Gtk";
import type { RadioToolButton } from "gi://Gtk?version=3.0";
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
import type { IconName } from "../../utils/icons/icon-types";
import type { AlignmentProps } from "../../utils/property-maps-factories/create-alignment-prop-mapper";
import { createAlignmentPropMapper } from "../../utils/property-maps-factories/create-alignment-prop-mapper";
import type { MarginProps } from "../../utils/property-maps-factories/create-margin-prop-mapper";
import { createMarginPropMapper } from "../../utils/property-maps-factories/create-margin-prop-mapper";
import type { StyleProps } from "../../utils/property-maps-factories/create-style-prop-mapper";
import { createStylePropMapper } from "../../utils/property-maps-factories/create-style-prop-mapper";
import type { TextNode } from "../markup/text-node";
import { ToolbarElement } from "./toolbar";

type ToolbarRadioButtonPropsMixin = AlignmentProps & MarginProps & StyleProps;

export interface ToolbarRadioButtonProps extends ToolbarRadioButtonPropsMixin {
  radioGroup: string;
  label?: string;
  icon?: IconName;
  useUnderline?: boolean;
  focusOnClick?: boolean;
  isDefault?: boolean;
  sameSize?: boolean;
  expand?: boolean;
  onClick?: (event: SyntheticEvent) => void;
  onChange?: (event: SyntheticEvent<{ isActive: boolean }>) => void;
  onMouseEnter?: (event: SyntheticEvent<PointerEvent>) => void;
  onMouseLeave?: (event: SyntheticEvent<PointerEvent>) => void;
}

export class ToolbarRadioButtonElement
  implements GjsElement<"TOOLBAR_RADIO_BUTTON", Gtk.RadioToolButton>
{
  static getContext(
    currentContext: HostContext<GjsContext>
  ): HostContext<GjsContext> {
    return currentContext.set({
      isInTextContext: true,
    });
  }

  readonly kind = "TOOLBAR_RADIO_BUTTON";
  widget = new Gtk.RadioToolButton();

  private parent: GjsElement | null = null;

  private readonly lifecycle = new ElementLifecycleController();
  private handlers!: EventHandlers<
    Gtk.ToggleToolButton,
    ToolbarRadioButtonProps
  >;
  private readonly propsMapper = new PropertyMapper<ToolbarRadioButtonProps>(
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

  notifyWillAppendTo(parent: GjsElement): void {
    if (GjsElementManager.isGjsElementOfKind(parent, ToolbarElement)) {
      this.parent = parent;

      const radioGroup = parent.getRadioGroup(
        this.propsMapper.currentProps.radioGroup!
      );

      this.widget = Gtk.RadioToolButton.new_from_widget(
        radioGroup
      ) as RadioToolButton;

      this.isInitialized = true;

      this.propsMapper.addCases(
        createAlignmentPropMapper(this.widget),
        createMarginPropMapper(this.widget),
        createStylePropMapper(this.widget),
        (props) =>
          props
            .label(DataType.String, (v = "") => {
              this.widget.label = v;
            })
            .useUnderline(DataType.Boolean, (v = false) => {
              this.widget.use_underline = v;
            })
            .focusOnClick(DataType.Boolean, (v = true) => {
              this.widget.focus_on_click = v;
            })
            .icon(DataType.String, (v) => {
              if (v) {
                this.widget.icon_name = v;
              }
            })
            .sameSize(DataType.Boolean, (v = true) => {
              this.widget.set_homogeneous(v);
            })
            .expand(DataType.Boolean, (v = false) => {
              this.widget.set_expand(v);
            })
      );

      this.handlers = new EventHandlers<
        Gtk.ToggleToolButton,
        ToolbarRadioButtonProps
      >(this.lifecycle, this.widget);

      this.handlers.bind("clicked", "onClick");
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

      if (this.propsMapper.currentProps.isDefault) {
        this.widget.set_active(true);
      }
    } else {
      throw new Error("ToolbarButton can only be a child of a toolbar.");
    }
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
