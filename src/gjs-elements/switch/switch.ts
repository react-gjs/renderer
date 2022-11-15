import { DataType } from "dilswer";
import Gtk from "gi://Gtk?version=3.0";
import { Align } from "../../g-enums";
import type { GjsElement } from "../gjs-element";
import type { ElementMargin } from "../utils/apply-margin";
import type { SyntheticEvent } from "../utils/event-handlers";
import { EventHandlers } from "../utils/event-handlers";
import type { DiffedProps } from "../utils/map-properties";
import { createPropMap } from "../utils/map-properties";
import type { AlignmentProps } from "../utils/property-maps-factories/create-alignment-prop-mapper";
import { createAlignmentPropMapper } from "../utils/property-maps-factories/create-alignment-prop-mapper";
import type { MarginProps } from "../utils/property-maps-factories/create-margin-prop-mapper";
import { createMarginPropMapper } from "../utils/property-maps-factories/create-margin-prop-mapper";

type SwitchPropsMixin = AlignmentProps & MarginProps;

export interface SwitchProps extends SwitchPropsMixin {
  margin?: ElementMargin;
  value?: boolean;
  onToggle?: (event: SyntheticEvent<{ state: boolean }>) => void;
}

export class SwitchElement implements GjsElement<"SWITCH"> {
  readonly kind = "SWITCH";

  private parent: Gtk.Container | null = null;
  widget = new Gtk.Switch();

  private readonly handlers = new EventHandlers<Gtk.Switch, SwitchProps>(
    this.widget
  );

  private readonly propsMapper = createPropMap<SwitchProps>(
    createAlignmentPropMapper(this.widget, { h: Align.CENTER }),
    createMarginPropMapper(this.widget),
    (props) =>
      props.value(DataType.Boolean, (v = false) => {
        this.widget.state = v;
        this.widget.active = v;
      })
  );

  constructor(props: any) {
    this.handlers.bind("state-set", "onToggle", (state) => {
      return {
        state,
      };
    });

    this.updateProps(props);
  }

  appendTo(parent: Gtk.Container): void {
    parent.add(this.widget);
    this.parent = parent;
  }

  appendChild(child: string | GjsElement<any>): void {
    throw new Error("Switch does not support children.");
  }

  updateProps(props: DiffedProps): void {
    this.propsMapper.update(props);
    this.handlers.update(props);
  }

  remove(parent: GjsElement<any>): void {
    this.propsMapper.cleanupAll();
    this.handlers.unbindAll();
    this.widget.destroy();
  }

  render() {
    this.parent?.show_all();
  }
}
