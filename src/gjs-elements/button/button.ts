import { DataType } from "dilswer";
import Gtk from "gi://Gtk";
import type { PositionType } from "../../g-enums";
import { diffProps } from "../../reconciler/diff-props";
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

type ButtonPropsMixin = AlignmentProps & MarginProps;

export interface ButtonProps extends ButtonPropsMixin {
  label?: string;
  image?: Gtk.Widget;
  imagePosition?: PositionType;
  useUnderline?: boolean;
  margin?: ElementMargin;
  onClick?: (event: SyntheticEvent) => void;
  onActivate?: (event: SyntheticEvent) => void;
  onEnter?: (event: SyntheticEvent) => void;
  onLeave?: (event: SyntheticEvent) => void;
  onPressed?: (event: SyntheticEvent) => void;
  onReleased?: (event: SyntheticEvent) => void;
}

const WidgetDataType = DataType.Custom(
  (v: any): v is Gtk.Widget => typeof v === "object"
);

export class ButtonElement implements GjsElement<"BUTTON", Gtk.Button> {
  readonly kind = "BUTTON";

  private parent: GjsElement | null = null;
  widget = new Gtk.Button();

  private readonly handlers = new EventHandlers<Gtk.Button, ButtonProps>(
    this.widget
  );

  private readonly propsMapper = createPropMap<ButtonProps>(
    createAlignmentPropMapper(this.widget),
    createMarginPropMapper(this.widget),
    (props) =>
      props
        .label(DataType.String, (v = "") => {
          this.widget.label = v;
        })
        .image(WidgetDataType, (v) => {
          this.widget.set_image(v ?? null);
        })
        .imagePosition(
          DataType.Enum(Gtk.PositionType),
          (v = Gtk.PositionType.LEFT) => {
            this.widget.image_position = v;
          }
        )
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
      if (this.widget.get_children().data) {
        throw new Error("Button can have only one child.");
      }
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
    throw new Error("Button can have only one child.");
  }

  diffProps(
    oldProps: Record<string, any>,
    newProps: Record<string, any>
  ): DiffedProps {
    return diffProps(oldProps, newProps, true);
  }
}
