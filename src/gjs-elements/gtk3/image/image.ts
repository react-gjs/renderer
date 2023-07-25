import { DataType } from "dilswer";
import GdkPixbuf from "gi://GdkPixbuf";
import Gio from "gi://Gio";
import Gtk from "gi://Gtk";
import cairo from "gi://cairo";
import type { GjsContext } from "../../../reconciler/gjs-renderer";
import type { HostContext } from "../../../reconciler/host-context";
import type { GjsElement } from "../../gjs-element";
import { diffProps } from "../../utils/diff-props";
import { ElementLifecycleController } from "../../utils/element-extenders/element-lifecycle-controller";
import { EventHandlers } from "../../utils/element-extenders/event-handlers";
import type { DiffedProps } from "../../utils/element-extenders/map-properties";
import { PropertyMapper } from "../../utils/element-extenders/map-properties";
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

type ImageSrc =
  | {
      src:
        | string
        | GdkPixbuf.Pixbuf
        | GdkPixbuf.PixbufAnimation
        | cairo.Surface;
      resizeToWidth?: number;
      resizeToHeight?: number;
      preserveAspectRatio?: boolean;
    }
  | {
      icon: string | Gio.Icon;
      iconSize?: number;
      useIconFallback?: boolean;
    };

type ImagePropsMixin = SizeRequestProps &
  AlignmentProps &
  MarginProps &
  ExpandProps &
  StyleProps &
  ImageSrc &
  TooltipProps;

export type ImageProps = ImagePropsMixin & {
  pixelSize?: number;
};

const SrcDataType = DataType.OneOf(
  DataType.String,
  DataType.RecordOf({}),
);
const IconDataType = DataType.OneOf(
  DataType.String,
  DataType.RecordOf({}),
);

const DEFAULT_ICON_SIZE = Gtk.IconSize.BUTTON;

export class ImageElement implements GjsElement<"IMAGE", Gtk.Image> {
  static getContext(
    currentContext: HostContext<GjsContext>,
  ): HostContext<GjsContext> {
    return currentContext;
  }

  readonly kind = "IMAGE";
  private widget = new Gtk.Image();

  private parent: GjsElement | null = null;

  readonly lifecycle = new ElementLifecycleController();
  private readonly handlers = new EventHandlers<
    Gtk.Image,
    ImageProps
  >(this);
  private readonly propsMapper = new PropertyMapper<ImageProps>(
    this.lifecycle,
    createSizeRequestPropMapper(this.widget),
    createAlignmentPropMapper(this.widget),
    createMarginPropMapper(this.widget),
    createExpandPropMapper(this.widget),
    createStylePropMapper(this.widget),
    createTooltipPropMapper(this.widget),
    (props) =>
      props
        .resizeToHeight(DataType.Number, () => {
          this.resizeImage();
        })
        .resizeToWidth(DataType.Number, (_, __, { instead }) =>
          instead("resizeToHeight"),
        )
        .preserveAspectRatio(DataType.Boolean, (_, __, { instead }) =>
          instead("resizeToHeight"),
        )
        .src(SrcDataType, (src, allProps) => {
          if (src && allProps?.icon) {
            throw new Error(
              "'icon' and 'src' props cannot be both used at the same time.",
            );
          }

          if (typeof src === "string") {
            this.setSrcFromString(src);
          } else if (src instanceof GdkPixbuf.Pixbuf) {
            this.widget.set_from_pixbuf(src);
          } else if (src instanceof GdkPixbuf.PixbufAnimation) {
            this.widget.set_from_animation(src);
          } else if (src instanceof cairo.Surface) {
            this.widget.set_from_surface(src);
          }

          if (
            allProps.resizeToWidth != null ||
            allProps.resizeToHeight != null
          ) {
            this.resizeImage();
          }
        })
        .icon(IconDataType, (icon, allProps) => {
          if (icon && allProps?.src) {
            throw new Error(
              "'icon' and 'src' props cannot be both used at the same time.",
            );
          }

          if (typeof icon === "string") {
            this.widget.set_from_icon_name(
              icon,
              allProps?.iconSize ?? DEFAULT_ICON_SIZE,
            );
          } else if (icon instanceof Gio.Icon) {
            this.widget.set_from_gicon(
              icon,
              allProps?.iconSize ?? DEFAULT_ICON_SIZE,
            );
          }
        })
        .iconSize(DataType.Number, (_, __, update) => {
          update.instead("icon");
        })
        .useIconFallback(DataType.Boolean, (v = false) => {
          this.widget.use_fallback = v;
        })
        .pixelSize(DataType.Number, (v) => {
          const prev = this.widget.pixel_size;
          if (v) this.widget.set_pixel_size(v);
          return () => this.widget.set_pixel_size(prev);
        }),
  );

  constructor(props: DiffedProps) {
    this.updateProps(props);

    this.lifecycle.emitLifecycleEventAfterCreate();
  }

  private resizeImage() {
    const width: number | undefined =
      this.propsMapper.get("resizeToWidth");
    const height: number | undefined =
      this.propsMapper.get("resizeToHeight");
    const preserveAspectRatio: boolean =
      this.propsMapper.get("preserveAspectRatio") ?? true;

    const pixbuff = this.widget.get_pixbuf()!;

    if (!pixbuff) return;

    const newPixbuff = resizePixbuff(
      pixbuff,
      width,
      height,
      preserveAspectRatio,
    );

    this.widget.set_from_pixbuf(newPixbuff);
  }

  private setSrcFromString(src: string) {
    if (src.startsWith("resource://")) {
      this.widget.set_from_resource(
        src.replace(/^resource:\/\//, ""),
      );
    } else {
      this.widget.set_from_file(src);
    }
  }

  updateProps(props: DiffedProps): void {
    this.lifecycle.emitLifecycleEventUpdate(props);
  }

  // #region This widget direct mutations

  appendChild(child: GjsElement | TextNode): void {
    throw new Error("Image cannot have children.");
  }

  insertBefore(): void {
    throw new Error("Image cannot have children.");
  }

  remove(parent: GjsElement): void {
    parent.notifyWillUnmount(this);

    this.lifecycle.emitLifecycleEventBeforeDestroy();

    this.widget.destroy();
  }

  render() {
    this.widget.show_all();
  }

  // #endregion

  // #region Element internal signals

  notifyWillAppendTo(parent: GjsElement): boolean {
    this.parent = parent;
    return true;
  }

  notifyWillUnmount() {}

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
    callback: Rg.GjsElementEvenTListenerCallback,
  ): void {
    return this.handlers.addListener(signal, callback);
  }

  removeEventListener(
    signal: string,
    callback: Rg.GjsElementEvenTListenerCallback,
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
    newProps: Record<string, any>,
  ): DiffedProps {
    return diffProps(oldProps, newProps, true);
  }

  // #endregion
}
