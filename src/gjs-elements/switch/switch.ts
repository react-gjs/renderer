import { DataType } from "dilswer";
import Gtk from "gi://Gtk?version=3.0";
import type { GjsElement } from "../gjs-element";
import type { ElementMargin } from "../utils/apply-margin";
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
  onToggle?: (value: boolean) => void;
}

export class SwitchElement implements GjsElement<"SWITCH"> {
  readonly kind = "SWITCH";

  private widget = new Gtk.Switch();
  private parent: Gtk.Container | null = null;

  private readonly handlers = new EventHandlers<Gtk.Switch, SwitchProps>(
    this.widget
  );

  private readonly mapProps = createPropMap<SwitchProps>(
    createAlignmentPropMapper(this.widget),
    createMarginPropMapper(this.widget),
    (props) =>
      props.value(DataType.Boolean, (v = false) => {
        this.widget.set_state(v);
      })
  );

  constructor(props: any) {
    this.handlers.bind("state-changed", "onToggle", () => [this.widget.state]);

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
    this.mapProps(props);
    this.handlers.update(props);
  }

  remove(parent: GjsElement<any>): void {
    this.handlers.unbindAll();
    this.widget.destroy();
  }

  render() {
    this.parent?.show_all();
  }
}
