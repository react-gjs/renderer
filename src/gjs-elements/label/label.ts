import { DataType } from "dilswer";
import Gtk from "gi://Gtk";
import Pango from "gi://Pango";
import type { EllipsizeMode, Justification, WrapMode } from "../../g-enums";
import { diffProps } from "../../reconciler/diff-props";
import type { GjsElement } from "../gjs-element";
import type { ElementMargin } from "../utils/apply-margin";
import { ElementLifecycleController } from "../utils/element-extenders/element-lifecycle-controller";
import type { DiffedProps } from "../utils/element-extenders/map-properties";
import { PropertyMapper } from "../utils/element-extenders/map-properties";
import type { AlignmentProps } from "../utils/property-maps-factories/create-alignment-prop-mapper";
import { createAlignmentPropMapper } from "../utils/property-maps-factories/create-alignment-prop-mapper";
import type { MarginProps } from "../utils/property-maps-factories/create-margin-prop-mapper";
import { createMarginPropMapper } from "../utils/property-maps-factories/create-margin-prop-mapper";

type LabelPropsMixin = AlignmentProps & MarginProps;

export interface LabelProps extends LabelPropsMixin {
  wrap?: boolean;
  wrapMode?: WrapMode;
  ellipsize?: EllipsizeMode;
  justify?: Justification;
  lines?: number;
  selectable?: boolean;
  children?: string | string[];
  margin?: ElementMargin;
}

export class LabelElement implements GjsElement<"LABEL", Gtk.Label> {
  readonly kind = "LABEL";
  widget = new Gtk.Label();

  private parent: GjsElement | null = null;

  private readonly lifecycle = new ElementLifecycleController();
  private readonly propsMapper = new PropertyMapper<LabelProps>(
    this.lifecycle,
    createAlignmentPropMapper(this.widget),
    createMarginPropMapper(this.widget),
    (props) =>
      props
        .wrap(DataType.Boolean, (v = true) => {
          this.widget.wrap = v;
        })
        .selectable(DataType.Boolean, (v = false) => {
          this.widget.selectable = v;
        })
        .lines(DataType.Number, (v = -1) => {
          this.widget.lines = v;
        })
        .ellipsize(
          DataType.Enum(Pango.EllipsizeMode),
          (v = Pango.EllipsizeMode.NONE) => {
            this.widget.ellipsize = v;
          }
        )
        .wrapMode(DataType.Enum(Pango.WrapMode), (v = Pango.WrapMode.CHAR) => {
          this.widget.wrap_mode = v;
        })
        .justify(
          DataType.Enum(Gtk.Justification),
          (v = Gtk.Justification.CENTER) => {
            this.widget.justify = v;
          }
        )
        .children(
          DataType.OneOf(DataType.String, DataType.ArrayOf(DataType.String)),
          (v = "") => {
            this.appendChild(v);
          }
        )
  );

  constructor(props: any) {
    this.updateProps(props);

    this.lifecycle.emitLifecycleEventAfterCreate();
  }

  updateProps(props: DiffedProps): void {
    this.lifecycle.emitLifecycleEventUpdate(props);
  }

  // #region This widget direct mutations

  appendChild(child: GjsElement | string | string[]): void {
    if (typeof child === "string") {
      this.widget.set_text(child);
    } else if (
      Array.isArray(child) &&
      child.every((c) => typeof c === "string")
    ) {
      let text = "";

      for (let i = 0; i < child.length; i++) {
        const subtext = child[i];
        text += subtext;
      }

      this.widget.set_text(text);
    } else {
      throw new TypeError("Label can only have text as it's children.");
    }
  }

  insertBefore(): void {
    throw new Error("Label cannot have children.");
  }

  remove(parent: GjsElement): void {
    parent.notifyWillUnmount(this);

    this.lifecycle.emitLifecycleEventBeforeDestroy();

    this.widget.destroy();
  }

  render() {
    this.parent?.widget.show_all();
  }

  // #endregion

  // #region Element internal signals

  notifyWillAppendTo(parent: GjsElement): void {
    this.parent = parent;
  }

  notifyWillUnmount() {}

  // #endregion

  // #region Utils for external use

  diffProps(
    oldProps: Record<string, any>,
    newProps: Record<string, any>
  ): DiffedProps {
    return diffProps(oldProps, newProps, true);
  }

  // #endregion
}
