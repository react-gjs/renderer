import type { GjsContext } from "../../../../reconciler/gjs-renderer";
import type { HostContext } from "../../../../reconciler/host-context";
import type { GjsElement } from "../../../gjs-element";
import { diffProps } from "../../../utils/diff-props";
import { ElementLifecycleController } from "../../../utils/element-extenders/element-lifecycle-controller";
import { EventHandlers } from "../../../utils/element-extenders/event-handlers";
import type { DiffedProps } from "../../../utils/element-extenders/map-properties";
import { PropertyMapper } from "../../../utils/element-extenders/map-properties";
import { ensureNotText } from "../../../utils/ensure-not-string";
import type { AlignmentProps } from "../../../utils/property-maps-factories/create-alignment-prop-mapper";
import { createAlignmentPropMapper } from "../../../utils/property-maps-factories/create-alignment-prop-mapper";
import type { ExpandProps } from "../../../utils/property-maps-factories/create-expand-prop-mapper";
import { createExpandPropMapper } from "../../../utils/property-maps-factories/create-expand-prop-mapper";
import type { MarginProps } from "../../../utils/property-maps-factories/create-margin-prop-mapper";
import { createMarginPropMapper } from "../../../utils/property-maps-factories/create-margin-prop-mapper";
import type { SizeRequestProps } from "../../../utils/property-maps-factories/create-size-request-prop-mapper";
import { createSizeRequestPropMapper } from "../../../utils/property-maps-factories/create-size-request-prop-mapper";
import type { StyleProps } from "../../../utils/property-maps-factories/create-style-prop-mapper";
import { createStylePropMapper } from "../../../utils/property-maps-factories/create-style-prop-mapper";
import { Bin } from "../../../utils/widgets/bin";
import type { TextNode } from "../../text-node";
import { isTextViewElementContainer } from "../is-text-view-element";
import type { TextViewElement } from "../text-view";
import type {
  ITextViewElement,
  TextViewElementContainer,
  TextViewNode,
} from "../text-view-elem-interface";

type TextViewWidgetPropsMixin = SizeRequestProps &
  AlignmentProps &
  MarginProps &
  ExpandProps &
  StyleProps;

export type TextViewWidgetProps = TextViewWidgetPropsMixin & {};

type TextViewWidgetElementMixin = GjsElement<"TEXT_VIEW_WIDGET", Bin> &
  ITextViewElement;

export class TextViewWidgetElement implements TextViewWidgetElementMixin {
  static getContext(
    currentContext: HostContext<GjsContext>
  ): HostContext<GjsContext> {
    return currentContext.set({
      isInTextContext: false,
    });
  }

  readonly kind = "TEXT_VIEW_WIDGET";
  private widget = new Bin();

  protected parent: TextViewElementContainer | null = null;

  readonly lifecycle = new ElementLifecycleController();
  private handlers = new EventHandlers<Bin, TextViewWidgetProps>(this);
  protected readonly propsMapper = new PropertyMapper<TextViewWidgetProps>(
    this.lifecycle,
    createSizeRequestPropMapper(this.widget),
    createAlignmentPropMapper(this.widget),
    createMarginPropMapper(this.widget),
    createExpandPropMapper(this.widget),
    createStylePropMapper(this.widget)
  );

  private child: GjsElement | null = null;

  constructor(props: DiffedProps) {
    this.updateProps(props);

    this.lifecycle.emitLifecycleEventAfterCreate();
  }

  updateProps(props: DiffedProps): void {
    this.lifecycle.emitLifecycleEventUpdate(props);
  }

  // #region This widget direct mutations

  appendChild(child: GjsElement | TextNode): void {
    if (this.child) {
      throw new Error("TextViewWidget cannot have more than one child.");
    }

    ensureNotText(child);

    const shouldAppend = child.notifyWillAppendTo(this);

    if (shouldAppend) {
      this.child = child;
      this.widget.add(child.getWidget());
    }
  }

  insertBefore(
    child: GjsElement | TextNode,
    beforeChild: GjsElement | TextNode
  ): void {
    throw new Error("TextViewWidget cannot have more than one child.");
  }

  remove(parent: GjsElement): void {
    parent.notifyWillUnmount(this);

    this.lifecycle.emitLifecycleEventBeforeDestroy();
  }

  render() {
    this.widget.show_all();
    this.getTextView()?.render();
  }

  // #endregion

  // #region Element internal signals

  notifyWillAppendTo(parent: GjsElement): boolean {
    if (isTextViewElementContainer(parent)) {
      this.parent = parent;
    } else {
      throw new Error(
        "TextViewWidget element can only be appended to a TextView element."
      );
    }
    return true;
  }

  notifyWillUnmount(child: GjsElement | TextNode) {
    if (this.child === child) {
      this.child = null;
    }
  }

  // #endregion

  // #region Utils for external use

  show() {
    this.widget.show();
  }

  hide() {
    this.widget.hide();
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
    this.handlers.addListener(signal, callback);
  }

  removeEventListener(
    signal: string,
    callback: Rg.GjsElementEvenTListenerCallback
  ): void {
    this.handlers.removeListener(signal, callback);
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

  getTextView(): TextViewElement | undefined {
    return this.parent?.getTextView();
  }

  toNode(): TextViewNode {
    return {
      type: "WIDGET",
      children: [this.widget],
    };
  }
}
