import { DataType } from "dilswer";
import GdkPixbuf from "gi://GdkPixbuf";
import type Gtk from "gi://Gtk?version=3.0";
import type { GjsContext } from "../../../../reconciler/gjs-renderer";
import type { HostContext } from "../../../../reconciler/host-context";
import type { GjsElement } from "../../../gjs-element";
import { diffProps } from "../../../utils/diff-props";
import { ElementLifecycleController } from "../../../utils/element-extenders/element-lifecycle-controller";
import type { DiffedProps } from "../../../utils/element-extenders/map-properties";
import { PropertyMapper } from "../../../utils/element-extenders/map-properties";
import { MarkupAttributes } from "../../../utils/markup-attributes";
import { resizePixbuff } from "../../../utils/resize-pixbuff";
import type { TextNode } from "../../text-node";
import { isTextViewElementContainer } from "../is-text-view-element";
import type { TextViewElement } from "../text-view";
import type {
  ITextViewElement,
  TextViewElementContainer,
  TextViewNode,
} from "../text-view-elem-interface";

export type TextViewImageProps = {
  src: string | GdkPixbuf.Pixbuf;
  resizeToWidth?: number;
  resizeToHeight?: number;
  preserveAspectRatio?: boolean;
};

type TextViewImageElementMixin = GjsElement<"TEXT_VIEW_IMAGE"> &
  ITextViewElement;

export class TextViewImageElement implements TextViewImageElementMixin {
  static getContext(
    currentContext: HostContext<GjsContext>
  ): HostContext<GjsContext> {
    return currentContext.set({
      isInTextContext: false,
    });
  }

  readonly kind = "TEXT_VIEW_IMAGE";
  private pixbuf!: GdkPixbuf.Pixbuf;

  protected parent: TextViewElementContainer | null = null;

  readonly lifecycle = new ElementLifecycleController();
  protected readonly propsMapper = new PropertyMapper<TextViewImageProps>(
    this.lifecycle,
    (props) =>
      props
        .src(DataType.OneOf(DataType.String, DataType.RecordOf({})), (v) => {
          if (typeof v === "string") {
            this.pixbuf = GdkPixbuf.Pixbuf.new_from_file(v)!;
          } else {
            this.pixbuf = v as any as GdkPixbuf.Pixbuf;
          }
        })
        .resizeToHeight(DataType.Number, () => {
          this.resizeImage();
        })
        .resizeToWidth(DataType.Number, (_, __, { instead }) =>
          instead("resizeToHeight")
        )
        .preserveAspectRatio(DataType.Boolean, (_, __, { instead }) =>
          instead("resizeToHeight")
        )
  );

  private isVisible = true;

  constructor(
    props: DiffedProps,
    context: HostContext<GjsContext>,
    beforeFirstUpdate?: (self: any) => void
  ) {
    if (beforeFirstUpdate) {
      beforeFirstUpdate(this);
    }

    this.updateProps(props);

    this.lifecycle.emitLifecycleEventAfterCreate();
  }

  private resizeImage() {
    const width: number | undefined = this.propsMapper.get("resizeToWidth");
    const height: number | undefined = this.propsMapper.get("resizeToHeight");
    const preserveAspectRatio: boolean =
      this.propsMapper.get("preserveAspectRatio") ?? true;

    const pixbuff = this.pixbuf;

    if (!pixbuff) return;

    const newPixbuff = resizePixbuff(
      pixbuff,
      width,
      height,
      preserveAspectRatio
    );

    this.pixbuf = newPixbuff;
  }

  updateProps(props: DiffedProps): void {
    this.lifecycle.emitLifecycleEventUpdate(props);
    this.render();
  }

  // #region This widget direct mutations

  appendChild(child: GjsElement | TextNode): void {
    throw new Error("TextViewImage elements cannot have children.");
  }

  insertBefore(
    child: GjsElement | TextNode,
    beforeChild: GjsElement | TextNode
  ): void {
    throw new Error("TextViewImage elements cannot have children.");
  }

  remove(parent: GjsElement): void {
    parent.notifyWillUnmount(this);

    this.lifecycle.emitLifecycleEventBeforeDestroy();
  }

  render() {
    this.getTextView()?.render();
  }

  // #endregion

  // #region Element internal signals

  notifyWillAppendTo(parent: GjsElement): boolean {
    if (isTextViewElementContainer(parent)) {
      this.parent = parent;
    } else {
      throw new Error(
        "TextViewImage elements can only be appended to a TextView elements."
      );
    }
    return true;
  }

  notifyWillUnmount() {}

  // #endregion

  // #region Utils for external use

  show() {
    this.isVisible = true;
    this.render();
  }

  hide() {
    this.isVisible = false;
    this.render();
  }

  getWidget(): Gtk.Widget {
    throw new Error("TextViewImage does not have a corresponding widget.");
  }

  getParentElement() {
    return this.parent;
  }

  addEventListener(
    signal: string,
    callback: Rg.GjsElementEvenTListenerCallback
  ): void {}

  removeEventListener(
    signal: string,
    callback: Rg.GjsElementEvenTListenerCallback
  ): void {}

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

  getTextView(): TextViewElement | undefined {
    return this.parent?.getTextView();
  }

  toNode(): TextViewNode {
    if (!this.isVisible) {
      return {
        type: "SPAN",
        attributes: new MarkupAttributes(),
        children: [],
      };
    }

    return {
      type: "IMAGE",
      children: [this.pixbuf],
    };
  }
}
