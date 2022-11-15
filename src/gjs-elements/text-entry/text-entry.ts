import { DataType } from "dilswer";
import Gdk from "gi://Gdk?version=3.0";
import Gtk from "gi://Gtk?version=3.0";
import type { GjsElement } from "../gjs-element";
import type { ElementMargin } from "../utils/apply-margin";
import type { SyntheticEvent } from "../utils/event-handlers";
import { EventHandlers } from "../utils/event-handlers";
import type { DiffedProps } from "../utils/map-properties";
import { createPropMap } from "../utils/map-properties";
import type { KeyPressEvent } from "../utils/parse-event-key";
import { parseEventKey } from "../utils/parse-event-key";
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

export class TextEntryElement implements GjsElement<"TEXT_ENTRY"> {
  readonly kind = "TEXT_ENTRY";

  private textBuffer = new Gtk.EntryBuffer();
  private parent: Gtk.Container | null = null;
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

  appendTo(parent: Gtk.Container): void {
    parent.add(this.widget);
    this.parent = parent;
  }

  appendChild(child: GjsElement<any> | string): void {
    throw new Error("Text Entry cannot have children.");
  }

  remove(parent: GjsElement<any>): void {
    this.propsMapper.cleanupAll();
    this.handlers.unbindAll();
    this.widget.destroy();
  }

  updateProps(props: DiffedProps): void {
    this.propsMapper.update(props);
    this.handlers.update(props);
  }

  render() {
    this.parent?.show_all();
  }
}
