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
import type { BaseMarkupElement } from "./markup-elem";
import type { TextNode } from "./text-node";
import { isMarkupElement } from "./utils/is-markup-elements";

type MarkupPropsMixin = AlignmentProps & MarginProps;

export interface MarkupProps extends MarkupPropsMixin {
  wrap?: boolean;
  wrapMode?: WrapMode;
  ellipsize?: EllipsizeMode;
  justify?: Justification;
  lines?: number;
  selectable?: boolean;
  children?: React.ReactElement | React.ReactElement[];
  margin?: ElementMargin;
}

export class MarkupElement implements GjsElement<"MARKUP", Gtk.Label> {
  readonly kind = "MARKUP";
  widget = new Gtk.Label();

  private parent: GjsElement | null = null;
  private children: Array<BaseMarkupElement> = [];

  private readonly lifecycle = new ElementLifecycleController();
  private readonly propsMapper = new PropertyMapper<MarkupProps>(
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
  );

  constructor(props: any) {
    this.updateProps(props);

    this.lifecycle.emitLifecycleEventAfterCreate();
  }

  updateProps(props: DiffedProps): void {
    this.lifecycle.emitLifecycleEventUpdate(props);
  }

  // #region This widget direct mutations

  appendChild(child: GjsElement | TextNode): void {
    if (child.kind === "TEXT_NODE" || !isMarkupElement(child)) {
      throw new Error(
        "Markdown root element can only have other markdown elements, like <span />, <i />, etc."
      );
    }

    this.children.push(child);
  }

  insertBefore(
    child: GjsElement | TextNode,
    beforeChild: GjsElement | TextNode
  ): void {
    if (child.kind === "TEXT_NODE" || !isMarkupElement(child)) {
      throw new Error(
        "Markdown root element can only have other markdown elements, like <span />, <i />, etc."
      );
    }

    const beforeChildIndex = this.children.indexOf(beforeChild as any);

    if (beforeChildIndex === -1) {
      throw new Error("The beforeChild element was not found.");
    }

    this.children.splice(beforeChildIndex, 0, child);
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

  notifyWillUnmount(child: GjsElement) {
    const childIndex = this.children.indexOf(child as any);

    if (childIndex === -1) {
      throw new Error("The child element was not found.");
    }

    this.children.splice(childIndex, 1);
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

  getMarkupRoot(): MarkupElement {
    return this;
  }

  private paint() {
    const content = this.children
      .map((child) => {
        return child.stringify();
      })
      .join("");

    this.widget.set_markup(content);
  }
}
