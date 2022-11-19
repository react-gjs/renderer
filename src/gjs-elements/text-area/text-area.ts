import { DataType } from "dilswer";
import Gdk from "gi://Gdk";
import Gtk from "gi://Gtk";
import { diffProps } from "../../reconciler/diff-props";
import type { GjsElement } from "../gjs-element";
import type { ElementMargin } from "../utils/apply-margin";
import type { SyntheticEvent } from "../utils/event-handlers";
import { EventHandlers } from "../utils/event-handlers";
import type { KeyPressEvent } from "../utils/gdk-events/key-press-event";
import { parseEventKey } from "../utils/gdk-events/key-press-event";
import { getStrByteSize } from "../utils/get-str-byte-size";
import type { DiffedProps } from "../utils/map-properties";
import { createPropMap } from "../utils/map-properties";
import type { AlignmentProps } from "../utils/property-maps-factories/create-alignment-prop-mapper";
import { createAlignmentPropMapper } from "../utils/property-maps-factories/create-alignment-prop-mapper";
import type { MarginProps } from "../utils/property-maps-factories/create-margin-prop-mapper";
import { createMarginPropMapper } from "../utils/property-maps-factories/create-margin-prop-mapper";

type TextAreaPropsMixin = AlignmentProps & MarginProps;

export interface TextAreaProps extends TextAreaPropsMixin {
  value?: string;
  margin?: ElementMargin;
  onChange?: (event: SyntheticEvent<{ text: string }>) => void;
  onKeyPress?: (event: SyntheticEvent<KeyPressEvent>) => void;
  onKeyRelease?: (event: SyntheticEvent<KeyPressEvent>) => void;
}

export class TextAreaElement implements GjsElement<"TEXT_AREA", Gtk.TextView> {
  readonly kind = "TEXT_AREA";

  private textBuffer = new Gtk.TextBuffer();
  private parent: GjsElement | null = null;

  widget = new Gtk.TextView({
    buffer: this.textBuffer,
    vexpand: true,
  });

  private readonly handlers = new EventHandlers<Gtk.TextView, TextAreaProps>(
    this.widget
  );

  private readonly propsMapper = createPropMap<TextAreaProps>(
    createAlignmentPropMapper(this.widget),
    createMarginPropMapper(this.widget),
    (props) =>
      props.value(DataType.String, (v = "") => {
        this.widget.get_buffer().set_text(v, getStrByteSize(v));
      })
  );

  constructor(props: any) {
    let lastText = props.value ?? "";

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
  }

  notifyWillAppendTo(parent: GjsElement): void {
    this.parent = parent;
  }

  appendChild(child: GjsElement | string): void {
    throw new Error("Text Area cannot have children.");
  }

  notifyWillUnmount() {}

  remove(parent: GjsElement): void {
    parent.notifyWillUnmount(this);

    this.propsMapper.cleanupAll();
    this.handlers.unbindAll();
    this.widget.destroy();
  }

  updateProps(props: DiffedProps): void {
    this.propsMapper.update(props);
    this.handlers.update(props);
  }

  render() {
    this.parent?.widget.show_all();
  }

  insertBefore(): void {
    throw new Error("TextArea does not support children.");
  }

  diffProps(
    oldProps: Record<string, any>,
    newProps: Record<string, any>
  ): DiffedProps {
    return diffProps(oldProps, newProps, true);
  }
}
