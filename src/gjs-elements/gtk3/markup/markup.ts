import { DataType } from "dilswer";
import Gtk from "gi://Gtk";
import Pango from "gi://Pango";
import { WrapMode } from "../../../enums/custom";
import type { EllipsizeMode, Justification } from "../../../enums/gtk3-index";
import type { GjsContext } from "../../../reconciler/gjs-renderer";
import type { HostContext } from "../../../reconciler/host-context";
import { BaseElement, type GjsElement } from "../../gjs-element";
import type { ElementMargin } from "../../utils/apply-margin";
import { ElementLifecycleController } from "../../utils/element-extenders/element-lifecycle-controller";
import type { SyntheticEvent } from "../../utils/element-extenders/event-handlers";
import { EventHandlers } from "../../utils/element-extenders/event-handlers";
import type { DiffedProps } from "../../utils/element-extenders/map-properties";
import { PropertyMapper } from "../../utils/element-extenders/map-properties";
import { microThrottle } from "../../utils/micro-throttle";
import type { AlignmentProps } from "../../utils/property-maps-factories/create-alignment-prop-mapper";
import { createAlignmentPropMapper } from "../../utils/property-maps-factories/create-alignment-prop-mapper";
import type { ChildPropertiesProps } from "../../utils/property-maps-factories/create-child-props-mapper";
import { createChildPropsMapper } from "../../utils/property-maps-factories/create-child-props-mapper";
import type { ExpandProps } from "../../utils/property-maps-factories/create-expand-prop-mapper";
import { createExpandPropMapper } from "../../utils/property-maps-factories/create-expand-prop-mapper";
import type { MarginProps } from "../../utils/property-maps-factories/create-margin-prop-mapper";
import { createMarginPropMapper } from "../../utils/property-maps-factories/create-margin-prop-mapper";
import type { SizeRequestProps } from "../../utils/property-maps-factories/create-size-request-prop-mapper";
import { createSizeRequestPropMapper } from "../../utils/property-maps-factories/create-size-request-prop-mapper";
import type { StyleProps } from "../../utils/property-maps-factories/create-style-prop-mapper";
import { createStylePropMapper } from "../../utils/property-maps-factories/create-style-prop-mapper";
import { TO_PANGO_WRAP_MODE } from "../../utils/wrap-mode";
import type { TextNode } from "../text-node";
import type { BaseMarkupElement } from "./markup-elem";
import { isMarkupElement } from "./utils/is-markup-elements";

type MarkupPropsMixin =
  & ChildPropertiesProps
  & SizeRequestProps
  & AlignmentProps
  & MarginProps
  & ExpandProps
  & StyleProps;

export type MarkupEvent<P extends Record<string, any> = {}> = SyntheticEvent<P, MarkupElement>;

export interface MarkupProps extends MarkupPropsMixin {
  wrapMode?: WrapMode;
  ellipsize?: EllipsizeMode;
  justify?: Justification;
  lines?: number;
  selectable?: boolean;
  margin?: ElementMargin;
  xAlign?: number;
  yAlign?: number;
  onAnchorClick?: (event: MarkupEvent<{ href: string }>) => void;
}

export class MarkupElement extends BaseElement implements GjsElement<"MARKUP", Gtk.Label> {
  static getContext(
    currentContext: HostContext<GjsContext>,
  ): HostContext<GjsContext> {
    return currentContext;
  }

  readonly kind = "MARKUP";
  protected widget = new Gtk.Label();

  protected parent: GjsElement | null = null;
  protected children: Array<BaseMarkupElement> = [];

  readonly lifecycle = new ElementLifecycleController();
  protected readonly handlers = new EventHandlers<
    Gtk.Label,
    MarkupProps
  >(this);
  protected readonly propsMapper = new PropertyMapper<MarkupProps>(
    this.lifecycle,
    createSizeRequestPropMapper(this.widget),
    createAlignmentPropMapper(this.widget),
    createMarginPropMapper(this.widget),
    createExpandPropMapper(this.widget),
    createStylePropMapper(this.widget),
    createChildPropsMapper(
      () => this.widget,
      () => this.parent,
    ),
    (props) =>
      props
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
          },
        )
        .wrapMode(
          DataType.Enum(WrapMode),
          (v = WrapMode.WORD_CHAR) => {
            this.widget.wrap = v !== WrapMode.NONE;
            this.widget.wrap_mode = TO_PANGO_WRAP_MODE.get(v)!;
          },
        )
        .justify(
          DataType.Enum(Gtk.Justification),
          (v = Gtk.Justification.CENTER) => {
            this.widget.justify = v;
          },
        )
        .xAlign(DataType.Number, (v = 0) => {
          this.widget.set_xalign(v);
        })
        .yAlign(DataType.Number, (v = 0) => {
          this.widget.set_yalign(v);
        }),
  );

  constructor(props: DiffedProps) {
    super();
    this.handlers.bind("activate-link", "onAnchorClick", (e) => {
      return { href: e };
    });

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
        "Markup root element can only have other Markup elements, like <span />, <i />, etc.",
      );
    }

    child.notifyWillMountTo(this);
    this.children.push(child);
    child.notifyMounted();
  }

  insertBefore(
    child: GjsElement | TextNode,
    beforeChild: GjsElement | TextNode,
  ): void {
    if (child.kind === "TEXT_NODE" || !isMarkupElement(child)) {
      throw new Error(
        "Markup root element can only have other Markup elements, like <span />, <i />, etc.",
      );
    }

    const beforeChildIndex = this.children.indexOf(
      beforeChild as any,
    );

    if (beforeChildIndex === -1) {
      throw new Error("The beforeChild element was not found.");
    }

    child.notifyWillMountTo(this);
    this.children.splice(beforeChildIndex, 0, child);
    child.notifyMounted();
  }

  remove(parent: GjsElement): void {
    parent.notifyChildWillUnmount(this);

    this.lifecycle.emitLifecycleEventBeforeDestroy();

    this.widget.destroy();
  }

  protected triggerRepaint = microThrottle(() => {
    this.paint();
    this.widget.show_all();
  });

  render() {
    this.triggerRepaint();
  }

  // #endregion

  // #region Element internal signals

  notifyWillMountTo(parent: GjsElement): boolean {
    this.parent = parent;
    return true;
  }

  notifyMounted(): void {
    this.lifecycle.emitMountedEvent();
  }

  notifyChildWillUnmount(child: GjsElement) {
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

  // #endregion

  getMarkupRoot(): MarkupElement {
    return this;
  }

  protected paint() {
    const content = this.children
      .map((child) => {
        return child.stringify();
      })
      .join("");

    this.widget.set_markup(content);
  }
}
