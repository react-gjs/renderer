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

type CheckButtonPropsMixin = AlignmentProps & MarginProps;

export interface CheckButtonProps extends CheckButtonPropsMixin {
  label?: string;
  useUnderline?: boolean;
  margin?: ElementMargin;
  active?: boolean;
  onChange?: (event: SyntheticEvent<{ isActive: boolean }>) => void;
  onClick?: (event: SyntheticEvent) => void;
  onActivate?: (event: SyntheticEvent) => void;
  onEnter?: (event: SyntheticEvent) => void;
  onLeave?: (event: SyntheticEvent) => void;
  onPressed?: (event: SyntheticEvent) => void;
  onReleased?: (event: SyntheticEvent) => void;
}

export class CheckButtonElement
  implements GjsElement<"CHECK_BUTTON", Gtk.CheckButton>
{
  readonly kind = "CHECK_BUTTON";

  private parent: GjsElement | null = null;
  widget = new Gtk.CheckButton();

  private readonly handlers = new EventHandlers<
    Gtk.CheckButton,
    CheckButtonProps
  >(this.widget);

  private readonly propsMapper = createPropMap<CheckButtonProps>(
    createAlignmentPropMapper(this.widget),
    createMarginPropMapper(this.widget),
    (props) =>
      props
        .active(DataType.Boolean, (v = false) => {
          this.widget.active = v;
        })
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
    this.handlers.bind("toggled", "onChange", () => ({
      isActive: this.widget.active,
    }));

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

  notifyWillUnmount() {}

  remove(parent: GjsElement): void {
    parent.notifyWillUnmount(this);

    this.propsMapper.cleanupAll();
    this.handlers.unbindAll();
    this.widget.destroy();
  }

  render() {
    this.parent?.widget.show_all();
  }

  insertBefore(): void {
    throw new Error("CheckButton can have only one child.");
  }
}
