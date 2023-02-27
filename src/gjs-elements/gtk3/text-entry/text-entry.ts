import { DataType } from "dilswer";
import Gdk from "gi://Gdk?version=3.0";
import Gtk from "gi://Gtk";
import { InputType } from "../../../g-enums";
import type { GjsContext } from "../../../reconciler/gjs-renderer";
import type { HostContext } from "../../../reconciler/host-context";
import type { GjsElement } from "../../gjs-element";
import { diffProps } from "../../utils/diff-props";
import { ElementLifecycleController } from "../../utils/element-extenders/element-lifecycle-controller";
import type { SyntheticEvent } from "../../utils/element-extenders/event-handlers";
import { EventHandlers } from "../../utils/element-extenders/event-handlers";
import type { DiffedProps } from "../../utils/element-extenders/map-properties";
import { PropertyMapper } from "../../utils/element-extenders/map-properties";
import { parseEventKey } from "../../utils/gdk-events/key-press-event";
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
import type { TooltipProps } from "../../utils/property-maps-factories/create-tooltip-prop-mapper";
import { createTooltipPropMapper } from "../../utils/property-maps-factories/create-tooltip-prop-mapper";

type TextEntryPropsMixin = SizeRequestProps &
  AlignmentProps &
  MarginProps &
  ExpandProps &
  StyleProps &
  TooltipProps;

export type TextEntryElementEvent<P extends Record<string, any> = {}> =
  SyntheticEvent<P, TextEntryElement>;

export interface TextEntryProps extends TextEntryPropsMixin {
  value?: string;
  capsLockWarning?: boolean;
  disabled?: boolean;
  type?: InputType;
  maxLength?: number;
  placeholder?: string;
  icon?: Rg.IconName;
  iconTooltip?: string;
  secondaryIcon?: Rg.IconName;
  secondaryIconTooltip?: string;
  progress?: number;
  truncateMultilinePaste?: boolean;
  onChange?: (event: TextEntryElementEvent<{ text: string }>) => void;
  onEnter?: (event: TextEntryElementEvent) => void;
  onKeyPress?: (event: TextEntryElementEvent<Rg.KeyPressEventData>) => void;
  onKeyRelease?: (event: TextEntryElementEvent<Rg.KeyPressEventData>) => void;
}

export class TextEntryElement implements GjsElement<"TEXT_ENTRY", Gtk.Entry> {
  static getContext(
    currentContext: HostContext<GjsContext>
  ): HostContext<GjsContext> {
    return currentContext;
  }

  readonly kind = "TEXT_ENTRY";
  private textBuffer = new Gtk.EntryBuffer();
  private widget = new Gtk.Entry({
    buffer: this.textBuffer,
  });

  private parent: GjsElement | null = null;

  readonly lifecycle = new ElementLifecycleController();
  private readonly handlers = new EventHandlers<Gtk.Entry, TextEntryProps>(
    this
  );

  private readonly propsMapper = new PropertyMapper<TextEntryProps>(
    this.lifecycle,
    createSizeRequestPropMapper(this.widget),
    createAlignmentPropMapper(this.widget),
    createMarginPropMapper(this.widget),
    createExpandPropMapper(this.widget),
    createStylePropMapper(this.widget),
    createTooltipPropMapper(this.widget),
    (props) =>
      props
        .value(DataType.String, (v = "") => {
          if (this.widget.text !== v) {
            this.widget.set_text(v);
          }
        })
        .capsLockWarning(DataType.Boolean, (v = false) => {
          this.widget.caps_lock_warning = v;
        })
        .disabled(DataType.Boolean, (v = false) => {
          this.widget.editable = !v;
        })
        .icon(DataType.String, (v) => {
          this.widget.primary_icon_name = v ?? null;
        })
        .iconTooltip(DataType.String, (v) => {
          this.widget.primary_icon_tooltip_text = v ?? null;
        })
        .maxLength(DataType.Number, (v) => {
          this.widget.max_length = v ?? 0;
        })
        .placeholder(DataType.String, (v) => {
          this.widget.placeholder_text = v ?? null;
        })
        .progress(DataType.Number, (v) => {
          if (v) {
            this.widget.progress_fraction = Math.min(0, Math.max(v, 1));
          }
        })
        .secondaryIcon(DataType.String, (v) => {
          this.widget.secondary_icon_name = v ?? null;
        })
        .secondaryIconTooltip(DataType.String, (v) => {
          this.widget.secondary_icon_tooltip_text = v ?? null;
        })
        .truncateMultilinePaste(DataType.Boolean, (v = false) => {
          this.widget.truncate_multiline = v;
        })
        .type(DataType.Enum(InputType), (v = InputType.FREE_FORM) => {
          this.widget.input_purpose = v;

          if (v === InputType.PASSWORD || v === InputType.PIN) {
            this.widget.visibility = false;
          } else {
            this.widget.visibility = true;
          }
        })
  );

  constructor(props: DiffedProps) {
    this.handlers.bind("changed", "onChange", () => ({
      text: this.widget.text,
    }));
    this.handlers.bind("activate", "onEnter");
    this.handlers.bind("key-press-event", "onKeyPress", (event: Gdk.EventKey) =>
      parseEventKey(event, Gdk.EventType.KEY_PRESS)
    );
    this.handlers.bind(
      "key-release-event",
      "onKeyRelease",
      (event: Gdk.EventKey) => parseEventKey(event, Gdk.EventType.KEY_RELEASE)
    );

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
    this.widget.show_all();
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

  getWidget() {
    return this.widget;
  }

  getParentElement() {
    return this.parent;
  }

  addEventListener(
    signal: string,
    callback: Rg.GjsElementEvenTListenerCallback
  ): void {
    return this.handlers.addListener(signal, callback);
  }

  removeEventListener(
    signal: string,
    callback: Rg.GjsElementEvenTListenerCallback
  ): void {
    return this.handlers.removeListener(signal, callback);
  }

  setProperty(key: string, value: any) {
    this.lifecycle.emitLifecycleEventUpdate([[key, value]]);
  }

  getProperty(key: string) {
    return this.propsMapper.get(key);
  }

  diffProps(
    oldProps: Record<string, any>,
    newProps: Record<string, any>
  ): DiffedProps {
    return diffProps(oldProps, newProps, true);
  }

  // #endregion
}
