import { DataType } from "dilswer";
import GdkPixbuf from "gi://GdkPixbuf";
import type Gio from "gi://Gio";
import Gtk from "gi://Gtk";
import type { PositionType } from "../../../g-enums";
import { ButtonRole, ButtonType } from "../../../g-enums";
import { EventPhase } from "../../../reconciler/event-phase";
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
import { TextChildController } from "../../utils/element-extenders/text-child-controller";
import type { PointerData } from "../../utils/gdk-events/pointer-event";
import { parseCrossingEvent } from "../../utils/gdk-events/pointer-event";
import type { AccelProps } from "../../utils/property-maps-factories/create-accel-prop-mapper";
import { createAccelPropMapper } from "../../utils/property-maps-factories/create-accel-prop-mapper";
import type { AlignmentProps } from "../../utils/property-maps-factories/create-alignment-prop-mapper";
import { createAlignmentPropMapper } from "../../utils/property-maps-factories/create-alignment-prop-mapper";
import type { ExpandProps } from "../../utils/property-maps-factories/create-expand-prop-mapper";
import { createExpandPropMapper } from "../../utils/property-maps-factories/create-expand-prop-mapper";
import type { MarginProps } from "../../utils/property-maps-factories/create-margin-prop-mapper";
import { createMarginPropMapper } from "../../utils/property-maps-factories/create-margin-prop-mapper";
import type { SizeRequestProps } from "../../utils/property-maps-factories/create-size-request-prop-mapper";
import { createSizeRequestPropMapper } from "../../utils/property-maps-factories/create-size-request-prop-mapper";
import type { StyleProps } from "../../utils/property-maps-factories/create-style-prop-mapper";
import { createStylePropMapper } from "../../utils/property-maps-factories/create-style-prop-mapper";
import type { TooltipProps } from "../../utils/property-maps-factories/create-tooltip-prop-mapper";
import { createTooltipPropMapper } from "../../utils/property-maps-factories/create-tooltip-prop-mapper";
import { resizePixbuff } from "../../utils/resize-pixbuff";
import type { TextNode } from "../text-node";

type ModelButtonPropsMixin = SizeRequestProps &
  AlignmentProps &
  MarginProps &
  ExpandProps &
  StyleProps &
  TooltipProps &
  AccelProps;

export type ModelButtonEvent<P extends Record<string, any> = {}> =
  SyntheticEvent<P, ModelButtonElement>;

export interface ModelButtonProps extends ModelButtonPropsMixin {
  type?: ButtonType;
  label?: string;
  image?: string | GdkPixbuf.Pixbuf;
  imageWidth?: number;
  imageHeight?: number;
  imagePreserveAspectRatio?: boolean;
  icon?: Rg.IconName;
  iconPixelSize?: number;
  imagePosition?: PositionType;
  useUnderline?: boolean;
  margin?: ElementMargin;
  focusOnClick?: boolean;
  alwaysShowImage?: boolean;
  centered?: boolean;
  inverted?: boolean;
  active?: boolean;
  role?: ButtonRole;
  onClick?: (event: ModelButtonEvent) => void;
  onActivate?: (event: ModelButtonEvent) => void;
  onPressed?: (event: ModelButtonEvent) => void;
  onReleased?: (event: ModelButtonEvent) => void;
  onMouseEnter?: (event: ModelButtonEvent<PointerData>) => void;
  onMouseLeave?: (event: ModelButtonEvent<PointerData>) => void;
}

const ImageDataType = DataType.OneOf(
  DataType.String,
  DataType.Custom((v): v is GdkPixbuf.Pixbuf => typeof v === "object")
);

export class ModelButtonElement
  implements GjsElement<"MODEL_BUTTON", Gtk.ModelButton>
{
  static getContext(
    currentContext: HostContext<GjsContext>
  ): HostContext<GjsContext> {
    return currentContext.set({
      isInTextContext: true,
    });
  }

  readonly kind = "MODEL_BUTTON";
  private widget = new Gtk.ModelButton();

  private parent: GjsElement | null = null;

  readonly lifecycle = new ElementLifecycleController();
  private readonly handlers = new EventHandlers<
    Gtk.ModelButton,
    ModelButtonProps
  >(this);
  private readonly propsMapper = new PropertyMapper<ModelButtonProps>(
    this.lifecycle,
    createSizeRequestPropMapper(this.widget),
    createAlignmentPropMapper(this.widget),
    createMarginPropMapper(this.widget),
    createExpandPropMapper(this.widget),
    createStylePropMapper(this.widget),
    createTooltipPropMapper(this.widget),
    createAccelPropMapper(this.widget),
    (props) =>
      props
        .label(DataType.String, (v) => {
          this.widget.text = v ?? "";
        })
        .alwaysShowImage(DataType.Boolean, (v = false) => {
          this.widget.always_show_image = v;
        })
        .image(ImageDataType, (v, allProps) => {
          if (v) {
            if (allProps.icon) {
              throw new Error("Cannot set both image and icon");
            }

            this.setImage(
              v,
              allProps.imageWidth,
              allProps.imageHeight,
              allProps.imagePreserveAspectRatio
            );

            return () => this.widget.set_image(null);
          }
        })
        .imageWidth(DataType.Number, (v, allProps, mapperApi) => {
          if (allProps.image && !allProps.icon) {
            if (!mapperApi.isUpdatedInThisCycle("image")) {
              this.resizeCurrentImage(
                v,
                allProps.imageHeight,
                allProps.imagePreserveAspectRatio
              );
            }
          }
        })
        .imageHeight(DataType.Number, (v, allProps, mapperApi) => {
          if (allProps.image && !allProps.icon) {
            if (
              !mapperApi.isUpdatedInThisCycle("image") &&
              !mapperApi.isUpdatedInThisCycle("imageWidth")
            ) {
              this.resizeCurrentImage(
                allProps.imageWidth,
                v,
                allProps.imagePreserveAspectRatio
              );
            }
          }
        })
        .imagePreserveAspectRatio(
          DataType.Boolean,
          (v, allProps, mapperApi) => {
            if (allProps.image && !allProps.icon) {
              if (
                !mapperApi.isUpdatedInThisCycle("image") &&
                !mapperApi.isUpdatedInThisCycle("imageWidth") &&
                !mapperApi.isUpdatedInThisCycle("imageHeight")
              ) {
                this.resizeCurrentImage(
                  allProps.imageWidth,
                  allProps.imageHeight,
                  v
                );
              }
            }
          }
        )
        .imagePosition(
          DataType.Enum(Gtk.PositionType),
          (v = Gtk.PositionType.LEFT) => {
            this.widget.image_position = v;
          }
        )
        .icon(DataType.String, (v, allProps) => {
          if (allProps.image) {
            throw new Error("Cannot set both image and icon");
          }

          if (v) {
            this.setImageIcon(v, allProps.iconPixelSize);
            return () => this.widget.set_image(null);
          }
        })
        .iconPixelSize(DataType.Number, (v = 16, allProps, mapperApi) => {
          if (
            allProps.icon != null &&
            !mapperApi.isUpdatedInThisCycle("icon")
          ) {
            this.setImageIcon(allProps.icon, v);
          }
        })
        .useUnderline(DataType.Boolean, (v = false) => {
          this.widget.use_underline = v;
        })
        .type(DataType.Enum(ButtonType), (v = ButtonType.NORMAL) => {
          switch (v) {
            case ButtonType.NORMAL:
              this.widget.relief = Gtk.ReliefStyle.NORMAL;
              break;
            case ButtonType.FLAT:
              this.widget.relief = Gtk.ReliefStyle.NONE;
              break;
          }
        })
        .focusOnClick(DataType.Boolean, (v = true) => {
          this.widget.focus_on_click = v;
        })
        .active(DataType.Boolean, (v = false) => {
          this.widget.active = v;
        })
        .centered(DataType.Boolean, (v = false) => {
          this.widget.centered = v;
        })
        .inverted(DataType.Boolean, (v = false) => {
          this.widget.inverted = v;
        })
        .role(DataType.Enum(ButtonRole), (v = ButtonRole.NORMAL) => {
          this.widget.role = v;
        })
  );

  private readonly children = new TextChildController(
    this.lifecycle,
    (text) => {
      this.widget.text = text;
    }
  );

  constructor(props: DiffedProps) {
    this.handlers.bind("clicked", "onClick");
    this.handlers.bind("activate", "onActivate");
    this.handlers.bind("pressed", "onPressed");
    this.handlers.bind("released", "onReleased");
    this.handlers.bind(
      "enter-notify-event",
      "onMouseEnter",
      parseCrossingEvent,
      EventPhase.Action
    );
    this.handlers.bind(
      "leave-notify-event",
      "onMouseLeave",
      parseCrossingEvent,
      EventPhase.Action
    );

    this.updateProps(props);

    this.lifecycle.emitLifecycleEventAfterCreate();
  }

  private resizeCurrentImage(
    width?: number,
    height?: number,
    preserveAspectRatio = true
  ) {
    const image = this.widget.image as Gtk.Image | null;
    if (image) {
      const pixbuff = image.get_pixbuf();
      if (pixbuff) {
        image.set_from_pixbuf(
          resizePixbuff(pixbuff, width, height, preserveAspectRatio)
        );
        this.widget.set_image(image);
      }
    }
  }

  private setImage(
    src: string | GdkPixbuf.Pixbuf,
    width?: number,
    height?: number,
    preserveAspectRatio = true
  ) {
    let pixbuff: GdkPixbuf.Pixbuf;

    if (typeof src === "string") {
      if (src.startsWith("resource://")) {
        pixbuff = GdkPixbuf.Pixbuf.new_from_resource(
          src.replace(/^resource:\/\//, "")
        )!;
      } else {
        pixbuff = GdkPixbuf.Pixbuf.new_from_file(src)!;
      }
    } else {
      pixbuff = src;
    }

    if (width != null && height != null) {
      pixbuff = resizePixbuff(pixbuff, width, height, preserveAspectRatio);
    }

    const image = Gtk.Image.new_from_pixbuf(pixbuff);

    this.widget.set_image(image);
  }

  private setImageIcon(icon: string | Gio.Icon, pixelSize?: number) {
    const iconWidget =
      typeof icon === "string"
        ? Gtk.Image.new_from_icon_name(icon, Gtk.IconSize.BUTTON)
        : Gtk.Image.new_from_gicon(icon, Gtk.IconSize.BUTTON);

    if (pixelSize != null) {
      iconWidget.set_pixel_size(pixelSize);
    }

    this.widget.set_image(iconWidget);
  }

  updateProps(props: DiffedProps): void {
    this.lifecycle.emitLifecycleEventUpdate(props);
  }

  // #region This widget direct mutations

  appendChild(child: TextNode | GjsElement): void {
    if (child.kind === "TEXT_NODE") {
      child.notifyWillAppendTo(this);
      this.children.addChild(child);
      return;
    }

    throw new Error("Button cannot have non-text children.");
  }

  insertBefore(
    child: TextNode | GjsElement,
    beforeChild: TextNode | GjsElement
  ): void {
    if (child.kind === "TEXT_NODE") {
      child.notifyWillAppendTo(this);
      this.children.insertBefore(child, beforeChild);
      return;
    }

    throw new Error("Button cannot have non-text children.");
  }

  remove(parent: GjsElement): void {
    parent.notifyWillUnmount(this);

    this.lifecycle.emitLifecycleEventBeforeDestroy();

    this.widget.destroy();
  }

  render() {
    this.children.update();
    this.widget.show_all();
  }

  // #endregion

  // #region Element internal signals

  notifyWillAppendTo(parent: GjsElement): boolean {
    this.parent = parent;
    return true;
  }

  notifyWillUnmount(child: TextNode | GjsElement) {
    this.children.removeChild(child);
  }

  // #endregion

  // #region Utils for external use

  show() {
    this.widget.visible = true;
  }

  hide() {
    this.widget.visible = false;
  }

  getWidget() {
    return this.widget;
  }

  getParentElement() {
    return this.parent;
  }

  addEventListener(
    signal: string,
    callback: Rg.GjsElementEvenTListenerCallback
  ): void {
    return this.handlers.addListener(signal, callback);
  }

  removeEventListener(
    signal: string,
    callback: Rg.GjsElementEvenTListenerCallback
  ): void {
    return this.handlers.removeListener(signal, callback);
  }

  setProperty(key: string, value: any) {
    this.lifecycle.emitLifecycleEventUpdate([[key, value]]);
  }

  getProperty(key: string) {
    return this.propsMapper.get(key);
  }

  diffProps(
    oldProps: Record<string, any>,
    newProps: Record<string, any>
  ): DiffedProps {
    return diffProps(oldProps, newProps, true);
  }

  // #endregion
}
