import { DataType } from "dilswer";
import type Gdk from "gi://Gdk";
import Gtk from "gi://Gtk";
import type { GjsElement } from "../gjs-element";
import type { SyntheticEvent } from "../utils/event-handlers";
import { EventHandlers } from "../utils/event-handlers";
import type { MouseButtonPressEvent } from "../utils/gdk-events/mouse-button-press-event";
import { parseMouseButtonPressEvent } from "../utils/gdk-events/mouse-button-press-event";
import type { DiffedProps } from "../utils/map-properties";
import { createPropMap } from "../utils/map-properties";
import type { AlignmentProps } from "../utils/property-maps-factories/create-alignment-prop-mapper";
import { createAlignmentPropMapper } from "../utils/property-maps-factories/create-alignment-prop-mapper";
import type { MarginProps } from "../utils/property-maps-factories/create-margin-prop-mapper";
import { createMarginPropMapper } from "../utils/property-maps-factories/create-margin-prop-mapper";

type PressablePropsMixin = AlignmentProps & MarginProps;

export interface PressableProps extends PressablePropsMixin {
  onClick?: (event: SyntheticEvent<MouseButtonPressEvent>) => void;
  onRelease?: (event: SyntheticEvent<MouseButtonPressEvent>) => void;
  /**
   * If set to true, the pressable element will intercept mouse
   * events on it's children. Meaning children will not receive
   * any mouse events.
   */
  interceptChildEvents?: boolean;
}

export class PressableElement implements GjsElement<"PRESSABLE", Gtk.EventBox> {
  readonly kind = "PRESSABLE";

  private parent: GjsElement | null = null;
  widget = new Gtk.EventBox();

  private handlers = new EventHandlers<Gtk.EventBox, PressableProps>(
    this.widget
  );

  private readonly propsMapper = createPropMap<PressableProps>(
    createAlignmentPropMapper(this.widget),
    createMarginPropMapper(this.widget),
    (props) =>
      props.interceptChildEvents(DataType.Boolean, (v = false) => {
        this.widget.set_above_child(v);
      })
  );

  constructor(props: any) {
    this.widget.set_visible_window(false);

    this.handlers.bind("button-press-event", "onClick", (e: Gdk.EventButton) =>
      parseMouseButtonPressEvent(e)
    );
    this.handlers.bind(
      "button-release-event",
      "onRelease",
      (e: Gdk.EventButton) => parseMouseButtonPressEvent(e)
    );

    this.updateProps(props);
  }

  notifyWillAppendTo(parent: GjsElement): void {
    this.parent = parent;
  }

  appendChild(child: GjsElement | string): void {
    if (typeof child === "string") {
      throw new Error("Box can only have other elements as it's children.");
    } else {
      child.notifyWillAppendTo(this);
      this.widget.add(child.widget);
      this.widget.show_all();
    }
  }

  notifyWillUnmount() {}

  remove(parent: GjsElement): void {
    parent.notifyWillUnmount(this);

    this.propsMapper.cleanupAll();
    this.widget.destroy();
  }

  updateProps(props: DiffedProps): void {
    this.propsMapper.update(props);
  }

  render() {
    this.parent?.widget.show_all();
  }
}