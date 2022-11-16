import { DataType } from "dilswer";
import Gtk from "gi://Gtk";
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

type LinkButtonPropsMixin = AlignmentProps & MarginProps;

export interface LinkButtonProps extends LinkButtonPropsMixin {
  label?: string;
  useUnderline?: boolean;
  margin?: ElementMargin;
  onClick?: (event: SyntheticEvent) => void;
  onActivate?: (event: SyntheticEvent) => void;
  onEnter?: (event: SyntheticEvent) => void;
  onLeave?: (event: SyntheticEvent) => void;
  onPressed?: (event: SyntheticEvent) => void;
  onReleased?: (event: SyntheticEvent) => void;
}

export class LinkButtonElement
  implements GjsElement<"LINK_BUTTON", Gtk.LinkButton>
{
  readonly kind = "LINK_BUTTON";

  private parent: GjsElement | null = null;
  widget = new Gtk.LinkButton();

  private readonly handlers = new EventHandlers<Gtk.Button, LinkButtonProps>(
    this.widget
  );

  private readonly propsMapper = createPropMap<LinkButtonProps>(
    createAlignmentPropMapper(this.widget),
    createMarginPropMapper(this.widget),
    (props) =>
      props
        .label(DataType.String, (v = "") => {
          this.widget.label = v;
        })
        .useUnderline(DataType.Boolean, (v = false) => {
          this.widget.use_underline = v;
        })
  );

  constructor(props: any) {
    this.handlers.bind("clicked", "onClick");
    this.handlers.bind("activate", "onActivate");
    this.handlers.bind("enter", "onEnter");
    this.handlers.bind("leave", "onLeave");
    this.handlers.bind("pressed", "onPressed");
    this.handlers.bind("released", "onReleased");

    this.updateProps(props);
  }

  notifyWillAppendTo(parent: GjsElement): void {
    this.parent = parent;
  }

  appendChild(child: string | GjsElement): void {
    if (typeof child === "string") {
      this.widget.label = child;
    } else {
      child.notifyWillAppendTo(this);
      this.widget.add(child.widget);
    }
    this.widget.show_all();
  }

  updateProps(props: DiffedProps): void {
    this.propsMapper.update(props);
    this.handlers.update(props);
  }

  remove(parent: GjsElement): void {
    this.propsMapper.cleanupAll();
    this.handlers.unbindAll();
    this.widget.destroy();
  }

  render() {
    this.parent?.widget.show_all();
  }
}
