import { DataType } from "dilswer";
import Gdk from "gi://Gdk?version=3.0";
import Gtk from "gi://Gtk";
import type { GjsElement } from "../gjs-element";
import type { ElementMargin } from "../utils/apply-margin";
import type { SyntheticEvent } from "../utils/event-handlers";
import { EventHandlers } from "../utils/event-handlers";
import type { KeyPressEvent } from "../utils/gdk-events/key-press-event";
import { parseEventKey } from "../utils/gdk-events/key-press-event";
import type { DiffedProps } from "../utils/map-properties";
import { createPropMap } from "../utils/map-properties";
import type { AlignmentProps } from "../utils/property-maps-factories/create-alignment-prop-mapper";
import { createAlignmentPropMapper } from "../utils/property-maps-factories/create-alignment-prop-mapper";
import type { MarginProps } from "../utils/property-maps-factories/create-margin-prop-mapper";
import { createMarginPropMapper } from "../utils/property-maps-factories/create-margin-prop-mapper";

type ButtonPropsMixin = AlignmentProps & MarginProps;

export interface TextEntryProps extends ButtonPropsMixin {
  value?: string;
  margin?: ElementMargin;
  onChange?: (event: SyntheticEvent<{ text: string }>) => void;
  onKeyPress?: (event: SyntheticEvent<KeyPressEvent>) => void;
  onKeyRelease?: (event: SyntheticEvent<KeyPressEvent>) => void;
}

export class TextEntryElement implements GjsElement<"TEXT_ENTRY", Gtk.Entry> {
  readonly kind = "TEXT_ENTRY";

  private textBuffer = new Gtk.EntryBuffer();
  private parent: GjsElement | null = null;
  widget = new Gtk.Entry({
    buffer: this.textBuffer,
    visible: true,
  });

  private readonly handlers = new EventHandlers<Gtk.Entry, TextEntryProps>(
    this.widget
  );

  private readonly propsMapper = createPropMap<TextEntryProps>(
    createAlignmentPropMapper(this.widget),
    createMarginPropMapper(this.widget),
    (props) =>
      props.value(DataType.String, (v = "") => {
        this.widget.set_text(v);
      })
  );

  constructor(props: any) {
    this.handlers.bind("changed", "onChange", () => ({
      text: this.widget.text,
    }));
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
    throw new Error("Text Entry cannot have children.");
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
    throw new Error("TextEntry does not support children.");
  }
}
