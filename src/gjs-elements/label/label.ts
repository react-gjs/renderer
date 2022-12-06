import { DataType } from "dilswer";
import Gtk from "gi://Gtk";
import Pango from "gi://Pango";
import type { EllipsizeMode, Justification, WrapMode } from "../../g-enums";
import type { GjsContext } from "../../reconciler/gjs-renderer";
import type { HostContext } from "../../reconciler/host-context";
import type { GjsElement } from "../gjs-element";
import type { TextNode } from "../markup/text-node";
import type { ElementMargin } from "../utils/apply-margin";
import { diffProps } from "../utils/diff-props";
import { ElementLifecycleController } from "../utils/element-extenders/element-lifecycle-controller";
import type { DiffedProps } from "../utils/element-extenders/map-properties";
import { PropertyMapper } from "../utils/element-extenders/map-properties";
import type { AlignmentProps } from "../utils/property-maps-factories/create-alignment-prop-mapper";
import { createAlignmentPropMapper } from "../utils/property-maps-factories/create-alignment-prop-mapper";
import type { MarginProps } from "../utils/property-maps-factories/create-margin-prop-mapper";
import { createMarginPropMapper } from "../utils/property-maps-factories/create-margin-prop-mapper";
import type { StyleProps } from "../utils/property-maps-factories/create-style-prop-mapper";
import { createStylePropMapper } from "../utils/property-maps-factories/create-style-prop-mapper";

type LabelPropsMixin = AlignmentProps & MarginProps & StyleProps;

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
  static getContext(
    currentContext: HostContext<GjsContext>
  ): HostContext<GjsContext> {
    return currentContext.set({
      isInTextContext: true,
    });
  }

  readonly kind = "LABEL";
  widget = new Gtk.Label();

  private parent: GjsElement | null = null;
  private children: TextNode[] = [];

  private readonly lifecycle = new ElementLifecycleController();
  private readonly propsMapper = new PropertyMapper<LabelProps>(
    this.lifecycle,
    createAlignmentPropMapper(this.widget),
    createMarginPropMapper(this.widget),
    createStylePropMapper(this.widget),
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
  );

  constructor(props: DiffedProps) {
    this.updateProps(props);

    this.lifecycle.emitLifecycleEventAfterCreate();
  }

  private paint() {
    const text = this.children.map((c) => c.getText()).join("");
    this.widget.set_text(text);
  }

  updateProps(props: DiffedProps): void {
    this.lifecycle.emitLifecycleEventUpdate(props);
  }

  // #region This widget direct mutations

  appendChild(child: GjsElement | TextNode): void {
    if (child.kind === "TEXT_NODE") {
      this.children.push(child);
      this.paint();
    } else {
      throw new TypeError("Label can only have text as it's children.");
    }
  }

  insertBefore(
    child: GjsElement | TextNode,
    beforeChild: GjsElement | TextNode
  ): void {
    if (child.kind === "TEXT_NODE") {
      const beforeIndex = this.children.indexOf(beforeChild as TextNode);

      if (beforeIndex === -1) {
        throw new Error("Before child not found.");
      }

      this.children.splice(beforeIndex, 0, child);
      this.paint();
    } else {
      throw new TypeError("Label can only have text as it's children.");
    }
  }

  remove(parent: GjsElement): void {
    parent.notifyWillUnmount(this);

    this.lifecycle.emitLifecycleEventBeforeDestroy();

    this.widget.destroy();
  }

  render() {
    this.paint();
    this.parent?.widget.show_all();
  }

  // #endregion

  // #region Element internal signals

  notifyWillAppendTo(parent: GjsElement): void {
    this.parent = parent;
  }

  notifyWillUnmount(child: GjsElement | TextNode) {
    const index = this.children.indexOf(child as TextNode);

    if (index === -1) {
      throw new Error("Child not found.");
    }

    this.children.splice(index, 1);
    this.paint();
  }

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
