import type Gtk from "gi://Gtk";
import type { GjsContext } from "../../../../reconciler/gjs-renderer";
import type { HostContext } from "../../../../reconciler/host-context";
import type { GjsElement } from "../../../gjs-element";
import { GjsElementManager } from "../../../gjs-element-manager";
import { diffProps } from "../../../utils/diff-props";
import { ElementLifecycleController } from "../../../utils/element-extenders/element-lifecycle-controller";
import type { DiffedProps } from "../../../utils/element-extenders/map-properties";
import { PropertyMapper } from "../../../utils/element-extenders/map-properties";
import { MarkupElement } from "../markup";
import type { BaseMarkupElement, MarkupElementProps } from "../markup-elem";
import type { TextNode } from "../text-node";
import { MAttributes } from "../utils/attributes";
import { createMarkupPropMapper } from "../utils/create-markup-prop-mapper";
import { escapeHtml } from "../utils/escape-html";
import { isMarkupElement } from "../utils/is-markup-elements";

export type MSpanProps = MarkupElementProps;

export class MSpanElement {
  static getContext(
    currentContext: HostContext<GjsContext>
  ): HostContext<GjsContext> {
    return currentContext.set({
      isInTextContext: true,
    });
  }

  readonly kind: Rg.GjsElementTypes = "M_SPAN";

  protected get widget(): Gtk.Widget {
    throw new Error("Markup elements do not have widgets.");
  }

  protected parent: BaseMarkupElement | MarkupElement | null = null;
  protected children: Array<TextNode | BaseMarkupElement> = [];
  protected attributes = new MAttributes();

  readonly lifecycle = new ElementLifecycleController();
  protected readonly propsMapper = new PropertyMapper<MSpanProps>(
    this.lifecycle,
    createMarkupPropMapper(this.attributes)
  );

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

  updateProps(props: DiffedProps): void {
    this.lifecycle.emitLifecycleEventUpdate(props);
    this.render();
  }

  // #region This widget direct mutations

  appendChild(child: GjsElement | TextNode): void {
    if (!isMarkupElement(child)) {
      throw new Error(
        "Markup elements can only have other Markup elements or strings as children."
      );
    }

    this.children.push(child);
  }

  insertBefore(
    child: GjsElement | TextNode,
    beforeChild: GjsElement | TextNode
  ): void {
    if (!isMarkupElement(child)) {
      throw new Error(
        "Markup elements can only have other Markup elements or strings as children."
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

  notifyWillAppendTo(parent: GjsElement): boolean {
    if (
      GjsElementManager.isGjsElementOfKind(parent, MarkupElement) ||
      isMarkupElement(parent)
    ) {
      this.parent = parent;
    } else {
      throw new Error("Markup elements can only be appended to a Markup.");
    }
    return true;
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
