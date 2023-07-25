import type { GjsContext } from "../../../../reconciler/gjs-renderer";
import type { HostContext } from "../../../../reconciler/host-context";
import { BaseElement, type GjsElement } from "../../../gjs-element";
import { ElementLifecycleController } from "../../../utils/element-extenders/element-lifecycle-controller";
import { EventHandlers } from "../../../utils/element-extenders/event-handlers";
import type { DiffedProps } from "../../../utils/element-extenders/map-properties";
import { PropertyMapper } from "../../../utils/element-extenders/map-properties";
import { ensureNotText } from "../../../utils/ensure-not-string";
import { mountAction } from "../../../utils/mount-action";
import type { AlignmentProps } from "../../../utils/property-maps-factories/create-alignment-prop-mapper";
import { createAlignmentPropMapper } from "../../../utils/property-maps-factories/create-alignment-prop-mapper";
import type { ChildPropertiesProps } from "../../../utils/property-maps-factories/create-child-props-mapper";
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

type TextViewWidgetPropsMixin = ChildPropertiesProps &
  SizeRequestProps &
  AlignmentProps &
  MarginProps &
  ExpandProps &
  StyleProps;

export type TextViewWidgetProps = TextViewWidgetPropsMixin & {};

type TextViewWidgetElementMixin = GjsElement<
  "TEXT_VIEW_WIDGET",
  Bin
> &
  ITextViewElement;

export class TextViewWidgetElement
  extends BaseElement
  implements TextViewWidgetElementMixin
{
  static getContext(
    currentContext: HostContext<GjsContext>,
  ): HostContext<GjsContext> {
    return currentContext.set({
      isInTextContext: false,
    });
  }

  readonly kind = "TEXT_VIEW_WIDGET";
  protected widget = new Bin();

  protected parent: TextViewElementContainer | null = null;

  readonly lifecycle = new ElementLifecycleController();
  protected handlers = new EventHandlers<Bin, TextViewWidgetProps>(
    this,
  );
  protected readonly propsMapper =
    new PropertyMapper<TextViewWidgetProps>(
      this.lifecycle,
      createSizeRequestPropMapper(this.widget),
      createAlignmentPropMapper(this.widget),
      createMarginPropMapper(this.widget),
      createExpandPropMapper(this.widget),
      createStylePropMapper(this.widget),
    );

  protected child: GjsElement | null = null;

  constructor(props: DiffedProps) {
    super();
    this.updateProps(props);

    this.lifecycle.emitLifecycleEventAfterCreate();
  }

  updateProps(props: DiffedProps): void {
    this.lifecycle.emitLifecycleEventUpdate(props);
  }

  // #region This widget direct mutations

  appendChild(child: GjsElement | TextNode): void {
    if (this.child) {
      throw new Error(
        "TextViewWidget cannot have more than one child.",
      );
    }

    ensureNotText(child);

    mountAction(this, child, (shouldOmitMount) => {
      if (!shouldOmitMount) {
        this.child = child;
        this.widget.add(child.getWidget());
      }
    });
  }

  insertBefore(
    child: GjsElement | TextNode,
    beforeChild: GjsElement | TextNode,
  ): void {
    throw new Error(
      "TextViewWidget cannot have more than one child.",
    );
  }

  remove(parent: GjsElement): void {
    parent.notifyChildWillUnmount(this);

    this.lifecycle.emitLifecycleEventBeforeDestroy();
  }

  render() {
    this.widget.show_all();
    this.getTextView()?.render();
  }

  // #endregion

  // #region Element internal signals

  notifyWillMountTo(parent: GjsElement): boolean {
    if (isTextViewElementContainer(parent)) {
      this.parent = parent;
    } else {
      throw new Error(
        "TextViewWidget element can only be appended to a TextView element.",
      );
    }
    return true;
  }

  notifyMountedTo(parent: GjsElement): void {
    this.lifecycle.emitMountedEvent();
  }

  notifyChildWillUnmount(child: GjsElement | TextNode) {
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
