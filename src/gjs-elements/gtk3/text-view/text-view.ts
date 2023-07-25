import { DataType } from "dilswer";
import Gdk from "gi://Gdk?version=3.0";
import Gtk from "gi://Gtk";
import { WrapMode } from "../../../enums/custom";
import type { Justification } from "../../../enums/gtk3-index";
import type { GjsContext } from "../../../reconciler/gjs-renderer";
import type { HostContext } from "../../../reconciler/host-context";
import type { GjsElement } from "../../gjs-element";
import { diffProps } from "../../utils/diff-props";
import { ElementLifecycleController } from "../../utils/element-extenders/element-lifecycle-controller";
import type { SyntheticEvent } from "../../utils/element-extenders/event-handlers";
import {
  EventHandlers,
  EventNoop,
} from "../../utils/element-extenders/event-handlers";
import type { DiffedProps } from "../../utils/element-extenders/map-properties";
import { PropertyMapper } from "../../utils/element-extenders/map-properties";
import type { MarkupAttributes } from "../../utils/markup-attributes";
import { microThrottle } from "../../utils/micro-throttle";
import type { AlignmentProps } from "../../utils/property-maps-factories/create-alignment-prop-mapper";
import { createAlignmentPropMapper } from "../../utils/property-maps-factories/create-alignment-prop-mapper";
import type { ExpandProps } from "../../utils/property-maps-factories/create-expand-prop-mapper";
import { createExpandPropMapper } from "../../utils/property-maps-factories/create-expand-prop-mapper";
import type { MarginProps } from "../../utils/property-maps-factories/create-margin-prop-mapper";
import { createMarginPropMapper } from "../../utils/property-maps-factories/create-margin-prop-mapper";
import type { SizeRequestProps } from "../../utils/property-maps-factories/create-size-request-prop-mapper";
import { createSizeRequestPropMapper } from "../../utils/property-maps-factories/create-size-request-prop-mapper";
import type { StyleProps } from "../../utils/property-maps-factories/create-style-prop-mapper";
import { createStylePropMapper } from "../../utils/property-maps-factories/create-style-prop-mapper";
import { ThemeVariable } from "../../utils/theme-vars";
import { TO_GTK_WRAP_MODE } from "../../utils/wrap-mode";
import type { TextNode } from "../text-node";
import { isTextViewElement } from "./is-text-view-element";
import type {
  ITextViewElement,
  TextViewNode,
} from "./text-view-elem-interface";

type TextViewPropsMixin = SizeRequestProps &
  AlignmentProps &
  MarginProps &
  ExpandProps &
  StyleProps;

export type TextViewEvent<P extends Record<string, any> = {}> =
  SyntheticEvent<P, TextViewElement>;

export interface TextViewProps extends TextViewPropsMixin {
  wrapMode?: WrapMode;
  lineTopMargin?: number;
  lineBottomMargin?: number;
  monospace?: boolean;
  jusification?: Justification;
  indent?: number;
  onLinkClick?: (event: TextViewEvent<{ href: string }>) => void;
}

export class TextViewElement
  implements GjsElement<"TEXT_VIEW", Gtk.TextView>
{
  static getContext(
    currentContext: HostContext<GjsContext>,
  ): HostContext<GjsContext> {
    return currentContext;
  }

  readonly kind = "TEXT_VIEW";
  private textBuffer = new Gtk.TextBuffer();
  private widget = new Gtk.TextView({
    buffer: this.textBuffer,
  });

  private parent: GjsElement | null = null;
  private children: Array<ITextViewElement> = [];

  readonly lifecycle = new ElementLifecycleController();
  private readonly handlers = new EventHandlers<
    Gtk.TextView,
    TextViewProps
  >(this);
  private readonly propsMapper = new PropertyMapper<TextViewProps>(
    this.lifecycle,
    createSizeRequestPropMapper(this.widget),
    createAlignmentPropMapper(this.widget, { h: Gtk.Align.FILL }),
    createMarginPropMapper(this.widget),
    createExpandPropMapper(this.widget, { h: true }),
    createStylePropMapper(this.widget, {
      backgroundColor: ThemeVariable.BackgroundColor,
      ":child(text)": {
        backgroundColor: ThemeVariable.BackgroundColor,
      },
    }),
    (props) =>
      props
        .wrapMode(
          DataType.Enum(WrapMode),
          (v = WrapMode.WORD_CHAR) => {
            this.widget.wrap_mode = TO_GTK_WRAP_MODE.get(v)!;
          },
        )
        .indent(DataType.Number, (v = 0) => {
          this.widget.indent = v;
        })
        .jusification(
          DataType.Enum(Gtk.Justification),
          (v = Gtk.Justification.LEFT) => {
            this.widget.justification = v;
          },
        )
        .lineBottomMargin(DataType.Number, (v = 0) => {
          this.widget.set_pixels_below_lines(v);
        })
        .lineTopMargin(DataType.Number, (v = 0) => {
          this.widget.set_pixels_above_lines(v);
        })
        .monospace(DataType.Boolean, (v = false) => {
          this.widget.monospace = v;
        }),
  );

  private embeddedLinks: Array<{
    start: number;
    end: number;
    href: string;
  }> = [];

  private embeddedWidgets: Array<{
    start: number;
    end: number;
  }> = [];

  constructor(props: DiffedProps) {
    this.widget.editable = false;
    this.widget.cursor_visible = false;

    this.handlers.bind("button-release-event", "onLinkClick", () => {
      if (!this.textBuffer.has_selection) {
        const cursorPosition = this.textBuffer.cursor_position;
        const iter =
          this.textBuffer.get_iter_at_offset(cursorPosition);
        for (const link of this.embeddedLinks) {
          const startIter = this.textBuffer.get_iter_at_offset(
            link.start,
          );
          const endIter = this.textBuffer.get_iter_at_offset(
            link.end,
          );
          if (iter!.in_range(startIter, endIter)) {
            return {
              href: link.href,
            };
          }
        }
      }
      throw new EventNoop();
    });

    this.handlers.bindInternal("motion-notify-event", (e) => {
      const motionEvent = e.originalEvent as Gdk.Event;
      const [, x, y] = motionEvent.get_coords();

      if (x != null && y != null) {
        const [, iter] = this.widget.get_iter_at_location(x, y);
        for (const link of this.embeddedLinks) {
          const startIter = this.textBuffer.get_iter_at_offset(
            link.start,
          );
          const endIter = this.textBuffer.get_iter_at_offset(
            link.end,
          );
          if (iter!.in_range(startIter, endIter)) {
            this.setCursor(Gdk.CursorType.HAND2);
            return;
          }
        }
        for (const widget of this.embeddedWidgets) {
          const startIter = this.textBuffer.get_iter_at_offset(
            widget.start,
          );
          const endIter = this.textBuffer.get_iter_at_offset(
            widget.end,
          );
          if (iter!.in_range(startIter, endIter)) {
            this.setCursor(Gdk.CursorType.ARROW);
            return;
          }
        }
        this.setCursor(Gdk.CursorType.XTERM);
      }
    });

    this.updateProps(props);

    this.lifecycle.emitLifecycleEventAfterCreate();
  }

  private setCursor(type: Gdk.CursorType) {
    const window = this.widget.get_window(Gtk.TextWindowType.TEXT);
    const currentCursor = window?.get_cursor();

    if (currentCursor?.get_cursor_type() !== type) {
      window?.set_cursor(
        Gdk.Cursor.new_for_display(Gdk.Display.get_default()!, type),
      );
    }
  }

  updateProps(props: DiffedProps): void {
    this.lifecycle.emitLifecycleEventUpdate(props);
  }

  // #region This widget direct mutations

  appendChild(child: GjsElement | TextNode): void {
    if (child.kind === "TEXT_NODE" || !isTextViewElement(child)) {
      throw new Error(
        "TextView root element can only have other TextView elements, like <TextViewSpan /> or <TextViewImage />, etc.",
      );
    }

    child.notifyWillAppendTo(this);
    this.children.push(child);
  }

  insertBefore(
    child: GjsElement | TextNode,
    beforeChild: GjsElement | TextNode,
  ): void {
    if (child.kind === "TEXT_NODE" || !isTextViewElement(child)) {
      throw new Error(
        "TextView root element can only have other TextView elements, like <TextViewSpan /> or <TextViewImage />, etc.",
      );
    }

    const beforeChildIndex = this.children.indexOf(
      beforeChild as any,
    );

    if (beforeChildIndex === -1) {
      throw new Error("The beforeChild element was not found.");
    }

    child.notifyWillAppendTo(this);
    this.children.splice(beforeChildIndex, 0, child);
  }

  remove(parent: GjsElement): void {
    parent.notifyWillUnmount(this);

    this.lifecycle.emitLifecycleEventBeforeDestroy();

    this.widget.destroy();
  }

  private triggerRepaint = microThrottle(() => {
    this.paint();
    this.widget.show_all();
  });

  render() {
    this.triggerRepaint();
  }

  // #endregion

  // #region Element internal signals

  notifyWillAppendTo(parent: GjsElement): boolean {
    this.parent = parent;
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
    callback: Rg.GjsElementEvenTListenerCallback,
  ): void {
    return this.handlers.addListener(signal, callback);
  }

  removeEventListener(
    signal: string,
    callback: Rg.GjsElementEvenTListenerCallback,
  ): void {
    return this.handlers.removeListener(signal, callback);
  }

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

  getTextView(): TextViewElement {
    return this;
  }

  private insertNodesToBuffer(
    nodes: Array<TextViewNode>,
    parent?: {
      tag: string;
      attributes: MarkupAttributes;
    },
  ) {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i]!;
      switch (node.type) {
        case "TEXT": {
          const asMarkup = parent
            ? (text: string) =>
                `<${
                  parent.tag
                } ${parent.attributes.stringify()}>${text}</${
                  parent.tag
                }>`
            : (text: string) => `<span>${text}</span>`;

          for (const nodeTextEntry of node.children) {
            this.textBuffer.insert_markup(
              this.textBuffer.get_end_iter(),
              asMarkup(nodeTextEntry),
              -1,
            );
          }
          break;
        }
        case "IMAGE": {
          for (const nodeImageEntry of node.children) {
            this.textBuffer.insert_pixbuf(
              this.textBuffer.get_end_iter(),
              nodeImageEntry,
            );
          }
          break;
        }
        case "LINK": {
          const start = this.textBuffer.get_end_iter()!.get_offset();
          this.insertNodesToBuffer(node.children, {
            tag: "span",
            attributes: parent
              ? parent.attributes.merge(node.attributes)
              : node.attributes,
          });
          const end =
            this.textBuffer.get_end_iter()!.get_offset() + 1;

          this.embeddedLinks.push({ start, end, href: node.href });
          break;
        }
        case "SPAN": {
          this.insertNodesToBuffer(node.children, {
            tag: "span",
            attributes: parent
              ? parent.attributes.merge(node.attributes)
              : node.attributes,
          });
          break;
        }
        case "WIDGET": {
          const start = this.textBuffer.get_end_iter()!.get_offset();
          for (const widget of node.children) {
            const anchor = new Gtk.TextChildAnchor();
            this.textBuffer.insert_child_anchor(
              this.textBuffer.get_end_iter(),
              anchor,
            );
            this.widget.add_child_at_anchor(widget, anchor);
          }
          const end =
            this.textBuffer.get_end_iter()!.get_offset() + 1;
          this.embeddedWidgets.push({ start, end });
          break;
        }
      }
    }
  }

  private paint() {
    const nodes = this.children.map((child) => child.toNode());

    this.embeddedLinks = [];
    this.textBuffer.delete(
      this.textBuffer.get_start_iter(),
      this.textBuffer.get_end_iter(),
    );

    this.insertNodesToBuffer(nodes);
  }
}
