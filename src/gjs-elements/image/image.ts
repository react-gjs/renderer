import { DataType } from "dilswer";
import cairo from "gi://cairo";
import GdkPixbuf from "gi://GdkPixbuf";
import Gio from "gi://Gio";
import Gtk from "gi://Gtk";
import type { GjsElement } from "../gjs-element";
import type { DiffedProps } from "../utils/map-properties";
import { createPropMap } from "../utils/map-properties";
import type { AlignmentProps } from "../utils/property-maps-factories/create-alignment-prop-mapper";
import { createAlignmentPropMapper } from "../utils/property-maps-factories/create-alignment-prop-mapper";
import type { MarginProps } from "../utils/property-maps-factories/create-margin-prop-mapper";
import { createMarginPropMapper } from "../utils/property-maps-factories/create-margin-prop-mapper";

type ImageSrc =
  | {
      src:
        | string
        | GdkPixbuf.Pixbuf
        | GdkPixbuf.PixbufAnimation
        | cairo.Surface;
    }
  | {
      icon: string | Gio.Icon;
      iconSize?: number;
      useIconFallback?: boolean;
    };

type ImagePropsMixin = AlignmentProps & MarginProps & ImageSrc;

export type ImageProps = ImagePropsMixin & {
  pixelSize?: number;
};

const SrcDataType = DataType.OneOf(DataType.String, DataType.RecordOf({}));
const IconDataType = DataType.OneOf(DataType.String, DataType.RecordOf({}));

const DEFAULT_ICON_SIZE = 32;

export class ImageElement implements GjsElement<"IMAGE", Gtk.Image> {
  readonly kind = "IMAGE";

  private parent: GjsElement | null = null;
  widget = new Gtk.Image();

  private readonly propsMapper = createPropMap<ImageProps>(
    createAlignmentPropMapper(this.widget),
    createMarginPropMapper(this.widget),
    (props) =>
      props
        .src(SrcDataType, (src, allProps) => {
          if (allProps?.icon) {
            throw new Error(
              "'icon' and 'src' props cannot be both used at the same time."
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
        })
        .icon(IconDataType, (icon, allProps) => {
          if (allProps?.src) {
            throw new Error(
              "'icon' and 'src' props cannot be both used at the same time."
            );
          }

          if (typeof icon === "string") {
            this.widget.set_from_icon_name(
              icon,
              allProps?.iconSize ?? DEFAULT_ICON_SIZE
            );
          } else if (icon instanceof Gio.Icon) {
            this.widget.set_from_gicon(
              icon,
              allProps?.iconSize ?? DEFAULT_ICON_SIZE
            );
          }
        })
        .iconSize(DataType.Number, (_, __, update) => {
          update.instead("icon");
        })
        .useIconFallback(DataType.Boolean, (v = false) => {
          this.widget.use_fallback = v;
        })
  );

  constructor(props: any) {
    this.updateProps(props);
  }

  private setSrcFromString(src: string) {
    if (src.startsWith("resource:")) {
      this.widget.set_from_resource(src);
    } else {
      this.widget.set_from_file(src);
    }
  }

  notifyWillAppendTo(parent: GjsElement): void {
    this.parent = parent;
  }

  appendChild(child: GjsElement | string): void {
    throw new Error("Image cannot have children.");
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
