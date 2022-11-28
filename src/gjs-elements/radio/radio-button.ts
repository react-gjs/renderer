import { DataType } from "dilswer";
import Gtk from "gi://Gtk";
import { diffProps } from "../../reconciler/diff-props";
import type { GjsContext } from "../../reconciler/gjs-renderer";
import type { HostContext } from "../../reconciler/host-context";
import type { GjsElement } from "../gjs-element";
import { GjsElementManager } from "../gjs-element-manager";
import type { TextNode } from "../markup/text-node";
import { ElementLifecycleController } from "../utils/element-extenders/element-lifecycle-controller";
import type { SyntheticEvent } from "../utils/element-extenders/event-handlers";
import { EventHandlers } from "../utils/element-extenders/event-handlers";
import type { DiffedProps } from "../utils/element-extenders/map-properties";
import { PropertyMapper } from "../utils/element-extenders/map-properties";
import type { AlignmentProps } from "../utils/property-maps-factories/create-alignment-prop-mapper";
import { createAlignmentPropMapper } from "../utils/property-maps-factories/create-alignment-prop-mapper";
import type { MarginProps } from "../utils/property-maps-factories/create-margin-prop-mapper";
import { createMarginPropMapper } from "../utils/property-maps-factories/create-margin-prop-mapper";
import { RadioBoxElement } from "./radio-box";

type RadioButtonPropsMixin = AlignmentProps & MarginProps;

export interface RadioButtonProps extends RadioButtonPropsMixin {
  label?: string;
  useUnderline?: boolean;
  onChange?: (event: SyntheticEvent<{ isActive: boolean }>) => void;
  onClick?: (event: SyntheticEvent) => void;
  onActivate?: (event: SyntheticEvent) => void;
  onEnter?: (event: SyntheticEvent) => void;
  onLeave?: (event: SyntheticEvent) => void;
  onPressed?: (event: SyntheticEvent) => void;
  onReleased?: (event: SyntheticEvent) => void;
}

export class RadioButtonElement
  implements GjsElement<"RADIO_BUTTON", Gtk.RadioButton>
{
  static getContext(
    currentContext: HostContext<GjsContext>
  ): HostContext<GjsContext> {
    return currentContext;
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

  private unappliedProps: DiffedProps = [];

  constructor(props: DiffedProps) {
    this.updateProps(props);

    this.handlers.bind("clicked", "onClick");
    this.handlers.bind("activate", "onActivate");
    this.handlers.bind("enter", "onEnter");
    this.handlers.bind("leave", "onLeave");
    this.handlers.bind("pressed", "onPressed");
    this.handlers.bind("released", "onReleased");
    this.handlers.bind("toggled", "onChange", () => {
      return {
        isActive: this.widget.active,
      };
    });

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
    if (typeof child === "string") {
      this.widget.label = child;
    } else {
      if (this.widget.get_children().data) {
        throw new Error("Button can have only one child.");
      }
      child.notifyWillAppendTo(this);
      this.widget.add(child.widget);
    }
    this.widget.show_all();
  }

  insertBefore(): void {
    throw new Error("Button can have only one child.");
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

  notifyWillAppendTo(parent: GjsElement): void {
    if (GjsElementManager.isGjsElementOfKind(parent, RadioBoxElement)) {
      this.parent = parent;

      const widget = (this.w = Gtk.RadioButton.new_from_widget(
        parent.radioGroup
      ));

      this.propsMapper.addCases(
        createAlignmentPropMapper(widget),
        createMarginPropMapper(widget),
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

  notifyWillUnmount() {}

  // #endregion

  // #region Utils for external use

  diffProps(
    oldProps: Record<string, any>,
    newProps: Record<string, any>
  ): DiffedProps {
    return diffProps(oldProps, newProps, true);
  }

  // #endregion
}
