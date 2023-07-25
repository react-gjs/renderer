import { DataType } from "dilswer";
import type Gtk from "gi://Gtk?version=3.0";
import type { GjsContext } from "../../../../reconciler/gjs-renderer";
import type { HostContext } from "../../../../reconciler/host-context";
import type { GjsElement } from "../../../gjs-element";
import { diffProps } from "../../../utils/diff-props";
import { ElementLifecycleController } from "../../../utils/element-extenders/element-lifecycle-controller";
import type { DiffedProps } from "../../../utils/element-extenders/map-properties";
import { PropertyMapper } from "../../../utils/element-extenders/map-properties";
import { MarkupAttributes } from "../../../utils/markup-attributes";
import type { MarkupElementProps } from "../../markup/markup-elem";
import { createMarkupPropMapper } from "../../markup/utils/create-markup-prop-mapper";
import { escapeHtml } from "../../markup/utils/escape-html";
import type { TextNode } from "../../text-node";
import {
  isTextViewElement,
  isTextViewElementContainer,
} from "../is-text-view-element";
import type { TextViewElement } from "../text-view";
import type {
  ITextViewElement,
  TextViewElementContainer,
  TextViewNode,
} from "../text-view-elem-interface";

export interface TextViewLinkProps extends MarkupElementProps {
  href?: string;
}

type TextViewLinkElementMixin = GjsElement<"TEXT_VIEW_LINK"> &
  ITextViewElement;

export class TextViewLinkElement implements TextViewLinkElementMixin {
  static getContext(
    currentContext: HostContext<GjsContext>,
  ): HostContext<GjsContext> {
    return currentContext.set({
      isInTextContext: true,
    });
  }

  readonly kind = "TEXT_VIEW_LINK";

  protected parent: TextViewElementContainer | null = null;
  protected children: Array<ITextViewElement | TextNode> = [];
  protected attributes = new MarkupAttributes();

  readonly lifecycle = new ElementLifecycleController();
  protected readonly propsMapper =
    new PropertyMapper<TextViewLinkProps>(
      this.lifecycle,
      createMarkupPropMapper(this.attributes, {
        color: "#297ad2",
        underline: "single",
      }),
      (props) =>
        props.href(DataType.String, (href = "") => {
          this.linkHref = href;
        }),
    );

  private linkHref = "";
  private isVisible = true;

  constructor(
    props: DiffedProps,
    context: HostContext<GjsContext>,
    beforeFirstUpdate?: (self: any) => void,
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
    if (!isTextViewElement(child)) {
      throw new Error(
        "TextViewLink elements can only have other TextView elements or strings as children.",
      );
    }

    this.children.push(child);

    this.render();
  }

  insertBefore(
    child: GjsElement | TextNode,
    beforeChild: GjsElement | TextNode,
  ): void {
    if (!isTextViewElement(child)) {
      throw new Error(
        "TextViewLink elements can only have other TextView elements or strings as children.",
      );
    }

    const beforeChildIndex = this.children.indexOf(
      beforeChild as any,
    );

    if (beforeChildIndex === -1) {
      throw new Error("The beforeChild element was not found.");
    }

    this.children.splice(beforeChildIndex, 0, child);

    this.render();
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
        "TextViewLink elements can only be appended to a TextView elements.",
      );
    }
    return true;
  }

  notifyWillUnmount(child: GjsElement) {
    const childIndex = this.children.indexOf(child as any);

    if (childIndex === -1) {
      throw new Error("The child element was not found.");
    }

    this.children.splice(childIndex, 1);
    this.render();
  }

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
    throw new Error(
      "TextViewSpan does not have a corresponding widget.",
    );
  }

  getParentElement() {
    return this.parent;
  }

  addEventListener(
    signal: string,
    callback: Rg.GjsElementEvenTListenerCallback,
  ): void {}

  removeEventListener(
    signal: string,
    callback: Rg.GjsElementEvenTListenerCallback,
  ): void {}

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
      type: "LINK",
      href: this.linkHref,
      attributes: this.attributes.copy(),
      children: this.children.map((child): TextViewNode => {
        if (child.kind === "TEXT_NODE") {
          return {
            type: "TEXT",
            children: [escapeHtml(child.getText())],
          };
        } else {
          return child.toNode();
        }
      }),
    };
  }
}
