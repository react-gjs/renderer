import type Gtk from "gi://Gtk";
import { diffProps } from "../../../reconciler/diff-props";
import type { GjsElement } from "../../gjs-element";
import { GjsElementManager } from "../../gjs-element-manager";
import type { GjsElementTypes } from "../../gjs-element-types";
import { ElementLifecycleController } from "../../utils/element-extenders/element-lifecycle-controller";
import type { DiffedProps } from "../../utils/element-extenders/map-properties";
import { PropertyMapper } from "../../utils/element-extenders/map-properties";
import { MarkupElement } from "../markup";
import type { BaseMarkupElement, MarkupElementProps } from "../markup-elem";
import type { TextNode } from "../text-node";
import { MAttributes } from "../utils/attributes";
import { createMarkupPropMapper } from "../utils/create-markup-prop-mapper";
import { escapeHtml } from "../utils/escape-html";
import { isMarkupElement } from "../utils/is-markup-elements";

export type MSpanProps = MarkupElementProps;

export class MSpanElement {
  readonly kind: GjsElementTypes = "M_SPAN";

  get widget(): Gtk.Widget {
    throw new Error("Markdown elements do not have widgets.");
  }

  protected parent: BaseMarkupElement | MarkupElement | null = null;
  protected children: Array<TextNode | BaseMarkupElement> = [];
  protected attributes = new MAttributes();

  private readonly lifecycle = new ElementLifecycleController();
  private readonly propsMapper = new PropertyMapper<MSpanProps>(
    this.lifecycle,
    createMarkupPropMapper(this.attributes)
  );

  constructor(props: any) {
    this.updateProps(props);

    this.lifecycle.emitLifecycleEventAfterCreate();
  }

  updateProps(props: DiffedProps): void {
    this.lifecycle.emitLifecycleEventUpdate(props);
    this.render();
  }

  // #region This widget direct mutations

  appendChild(child: GjsElement | string | string[]): void {
    if (!isMarkupElement(child)) {
      throw new Error(
        "Markdown elements can only have other markdown elements or strings as children."
      );
    }

    this.children.push(child);
  }

  insertBefore(
    child: GjsElement | string | string[],
    beforeChild: GjsElement | string | string[]
  ): void {
    if (!isMarkupElement(child)) {
      throw new Error(
        "Markdown elements can only have other markdown elements or strings as children."
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
    this.parent?.getMarkupRoot()?.render();
  }

  // #endregion

  // #region Element internal signals

  notifyWillAppendTo(parent: GjsElement): void {
    if (
      GjsElementManager.isGjsElementOfKind(parent, MarkupElement) ||
      isMarkupElement(parent)
    ) {
      this.parent = parent;
    } else {
      throw new Error("Markdown elements can only be appended to a Markdown.");
    }
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

  protected mapChild = (child: TextNode | BaseMarkupElement) => {
    if (child.kind === "TEXT_NODE") {
      return escapeHtml(child.getText());
    } else {
      return child.stringify();
    }
  };

  stringify(): string {
    const content = this.children.flatMap(this.mapChild).join("");

    return `<span${this.attributes.stringify()}>${content}</span>`;
  }

  getMarkupRoot(): MarkupElement | undefined {
    return this.parent?.getMarkupRoot();
  }
}
