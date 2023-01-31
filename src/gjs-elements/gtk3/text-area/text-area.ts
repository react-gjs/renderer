import { DataType } from "dilswer";
import Gdk from "gi://Gdk";
import Gtk from "gi://Gtk";
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
import { parseEventKey } from "../../utils/gdk-events/key-press-event";
import { getStrByteSize } from "../../utils/get-str-byte-size";
import type { AlignmentProps } from "../../utils/property-maps-factories/create-alignment-prop-mapper";
import { createAlignmentPropMapper } from "../../utils/property-maps-factories/create-alignment-prop-mapper";
import type { ExpandProps } from "../../utils/property-maps-factories/create-expand-prop-mapper";
import { createExpandPropMapper } from "../../utils/property-maps-factories/create-expand-prop-mapper";
import type { MarginProps } from "../../utils/property-maps-factories/create-margin-prop-mapper";
import { createMarginPropMapper } from "../../utils/property-maps-factories/create-margin-prop-mapper";
import type { StyleProps } from "../../utils/property-maps-factories/create-style-prop-mapper";
import { createStylePropMapper } from "../../utils/property-maps-factories/create-style-prop-mapper";

type TextAreaPropsMixin = AlignmentProps &
  MarginProps &
  ExpandProps &
  StyleProps;

export type TextAreaEvent<P extends Record<string, any> = {}> = SyntheticEvent<
  P,
  TextAreaElement
>;

export interface TextAreaProps extends TextAreaPropsMixin {
  value?: string;
  margin?: ElementMargin;
  onChange?: (event: TextAreaEvent<{ text: string }>) => void;
  onKeyPress?: (event: TextAreaEvent<Rg.KeyPressEventData>) => void;
  onKeyRelease?: (event: TextAreaEvent<Rg.KeyPressEventData>) => void;
}

export class TextAreaElement implements GjsElement<"TEXT_AREA", Gtk.TextView> {
  static getContext(
    currentContext: HostContext<GjsContext>
  ): HostContext<GjsContext> {
    return currentContext;
  }

  readonly kind = "TEXT_AREA";
  private textBuffer = new Gtk.TextBuffer();
  widget = new Gtk.TextView({
    buffer: this.textBuffer,
    vexpand: true,
  });

  private parent: GjsElement | null = null;

  readonly lifecycle = new ElementLifecycleController();
  private readonly handlers = new EventHandlers<Gtk.TextView, TextAreaProps>(
    this
  );

  private readonly propsMapper = new PropertyMapper<TextAreaProps>(
    this.lifecycle,
    createAlignmentPropMapper(this.widget),
    createMarginPropMapper(this.widget),
    createExpandPropMapper(this.widget),
    createStylePropMapper(this.widget),
    (props) =>
      props.value(DataType.String, (v = "") => {
        this.widget.get_buffer().set_text(v, getStrByteSize(v));
      })
  );

  constructor(props: DiffedProps) {
    let lastText = "";

    this.handlers.bind("key-release-event", "onChange", () => {
      const currentText = this.widget.get_buffer().text;
      if (currentText !== lastText) {
        lastText = currentText;
        return { text: currentText };
      }
      throw new Error("no-op");
    });
    this.handlers.bind("key-press-event", "onKeyPress", (event: Gdk.EventKey) =>
      parseEventKey(event, Gdk.EventType.KEY_PRESS)
    );
    this.handlers.bind(
      "key-release-event",
      "onKeyRelease",
      (event: Gdk.EventKey) => parseEventKey(event, Gdk.EventType.KEY_RELEASE)
    );

    this.updateProps(props);

    if (this.propsMapper.currentProps.value) {
      lastText = this.propsMapper.currentProps.value;
    }

    this.lifecycle.emitLifecycleEventAfterCreate();
  }

  updateProps(props: DiffedProps): void {
    this.lifecycle.emitLifecycleEventUpdate(props);
  }

  // #region This widget direct mutations

  appendChild(): void {
    throw new Error("TextArea cannot have children.");
  }

  insertBefore(): void {
    throw new Error("TextArea cannot have children.");
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
