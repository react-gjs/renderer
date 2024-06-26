import { DataType } from "dilswer";
import Gdk from "gi://Gdk";
import Gtk from "gi://Gtk";
import type { InputPurpose, Justification } from "../../../enums/gtk3-index";
import { WrapMode } from "../../../enums/gtk3-index";
import type { GjsContext } from "../../../reconciler/gjs-renderer";
import type { HostContext } from "../../../reconciler/host-context";
import { BaseElement, type GjsElement } from "../../gjs-element";
import { ElementLifecycleController } from "../../utils/element-extenders/element-lifecycle-controller";
import type { SyntheticEvent } from "../../utils/element-extenders/event-handlers";
import { EventHandlers, EventNoop } from "../../utils/element-extenders/event-handlers";
import type { DiffedProps } from "../../utils/element-extenders/map-properties";
import { PropertyMapper } from "../../utils/element-extenders/map-properties";
import { parseEventKey } from "../../utils/gdk-events/key-press-event";
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
import { TO_GTK_WRAP_MODE } from "../../utils/wrap-mode";

type TextAreaPadding =
  | number
  | [number]
  | [number, number]
  | [number, number, number]
  | [number, number, number, number];

type TextAreaPropsMixin =
  & ChildPropertiesProps
  & SizeRequestProps
  & AlignmentProps
  & MarginProps
  & ExpandProps
  & StyleProps;

export type TextAreaEvent<P extends Record<string, any> = {}> = SyntheticEvent<P, TextAreaElement>;

export interface TextAreaProps extends TextAreaPropsMixin {
  value?: string;
  acceptTabs?: boolean;
  padding?: TextAreaPadding;
  disabled?: boolean;
  indent?: number;
  type?: InputPurpose;
  justification?: Justification;
  monospace?: boolean;
  wrapMode?: WrapMode;
  onSelectChange?: (
    event: TextAreaEvent<{
      selectedText: string;
      selectionStartIndex: number;
      selectionEndIndex: number;
    }>,
  ) => void;
  onChange?: (
    event: TextAreaEvent<{ text: string; cursorPosition: number }>,
  ) => void;
  onKeyPress?: (event: TextAreaEvent<Rg.KeyPressEventData>) => void;
  onKeyRelease?: (event: TextAreaEvent<Rg.KeyPressEventData>) => void;
}

export class TextAreaElement extends BaseElement implements GjsElement<"TEXT_AREA", Gtk.TextView> {
  static getContext(
    currentContext: HostContext<GjsContext>,
  ): HostContext<GjsContext> {
    return currentContext;
  }

  readonly kind = "TEXT_AREA";
  protected textBuffer = new Gtk.TextBuffer();
  protected widget = new Gtk.TextView({
    buffer: this.textBuffer,
  });

  protected parent: GjsElement | null = null;

  readonly lifecycle = new ElementLifecycleController();
  protected readonly handlers = null;
  protected readonly viewHandlers = new EventHandlers<
    Gtk.TextView,
    TextAreaProps
  >(this);
  protected readonly bufferHandlers = new EventHandlers<
    Gtk.TextBuffer,
    TextAreaProps
  >({
    lifecycle: this.lifecycle,
    getWidget: () => this.textBuffer,
  });

  protected readonly propsMapper = new PropertyMapper<TextAreaProps>(
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
        .value(DataType.String, (v = "") => {
          const currentText = this.textBuffer.text;
          if (currentText === v) {
            return;
          }

          const cursorPosition = this.textBuffer.cursor_position;

          this.textBuffer.set_text(v, -1);

          this.setCursorPosition(cursorPosition);
        })
        .acceptTabs(DataType.Boolean, (v = true) => {
          this.widget.set_accepts_tab(v);
        })
        .disabled(DataType.Boolean, (v = false) => {
          this.widget.set_editable(!v);
        })
        .indent(DataType.Number, (v = 0) => {
          this.widget.set_indent(Math.round(v));
        })
        .justification(
          DataType.Enum(Gtk.Justification),
          (v = Gtk.Justification.LEFT) => {
            this.widget.set_justification(v);
          },
        )
        .monospace(DataType.Boolean, (v = false) => {
          this.widget.set_monospace(v);
        })
        .type(
          DataType.Enum(Gtk.InputPurpose),
          (v = Gtk.InputPurpose.FREE_FORM) => {
            this.widget.set_input_purpose(v);
          },
        )
        .wrapMode(
          DataType.Enum(WrapMode),
          (v = WrapMode.WORD_CHAR) => {
            this.widget.set_wrap_mode(TO_GTK_WRAP_MODE.get(v)!);
          },
        )
        .padding(
          DataType.OneOf(
            DataType.Number,
            DataType.ArrayOf(DataType.Number),
          ),
          (v = 0) => {
            this.applyPadding(v);
          },
        ),
  );

  protected previousSelection = {
    start: 0,
    end: 0,
    text: "",
  };

  constructor(props: DiffedProps) {
    super();
    let lastText = "";

    this.bufferHandlers.bind("changed", "onChange", () => {
      const currentText = this.widget.get_buffer()!.text!;
      if (currentText !== lastText) {
        lastText = currentText;
        return {
          text: currentText,
          cursorPosition: this.textBuffer.cursor_position,
        };
      }
      throw new EventNoop();
    });

    this.viewHandlers.bind(
      "key-press-event",
      "onKeyPress",
      (event: Gdk.Event & Gdk.EventKey) => parseEventKey(event, Gdk.EventType.KEY_PRESS),
    );

    this.viewHandlers.bind(
      "key-release-event",
      "onKeyRelease",
      (event: Gdk.Event & Gdk.EventKey) => parseEventKey(event, Gdk.EventType.KEY_RELEASE),
    );

    this.viewHandlers.bind(
      "button-release-event",
      "onSelectChange",
      () => this.getSelectionEventData(),
    );

    this.bufferHandlers.bind(
      "notify::has-selection",
      "onSelectChange",
      () => this.getSelectionEventData(),
    );

    this.updateProps(props);

    if (this.propsMapper.currentProps.value) {
      lastText = this.propsMapper.currentProps.value;
    }

    this.lifecycle.emitLifecycleEventAfterCreate();
  }

  protected getSelectionEventData() {
    const [_, start, end] = this.textBuffer.get_selection_bounds();
    const selectedText = this.textBuffer.get_text(start, end, false)!;
    const selectionStartIndex = start!.get_offset();
    const selectionEndIndex = end!.get_offset();

    if (
      this.previousSelection.start === selectionStartIndex
      && this.previousSelection.end === selectionEndIndex
      && this.previousSelection.text === selectedText
    ) {
      throw new EventNoop();
    }

    this.previousSelection.start = selectionStartIndex;
    this.previousSelection.end = selectionEndIndex;
    this.previousSelection.text = selectedText;

    return {
      selectedText,
      selectionStartIndex,
      selectionEndIndex,
    };
  }

  protected applyPadding(padding: number | number[]) {
    if (typeof padding === "number") {
      this.widget.top_margin = padding;
      this.widget.right_margin = padding;
      this.widget.bottom_margin = padding;
      this.widget.left_margin = padding;
    } else if (padding.length === 1) {
      this.widget.top_margin = padding[0];
      this.widget.right_margin = padding[0];
      this.widget.bottom_margin = padding[0];
      this.widget.left_margin = padding[0];
    } else if (padding.length === 2) {
      this.widget.top_margin = padding[0];
      this.widget.right_margin = padding[1];
      this.widget.bottom_margin = padding[0];
      this.widget.left_margin = padding[1];
    } else if (padding.length === 3) {
      this.widget.top_margin = padding[0];
      this.widget.right_margin = padding[1];
      this.widget.bottom_margin = padding[2];
      this.widget.left_margin = padding[1];
    } else if (padding.length === 4) {
      this.widget.top_margin = padding[0];
      this.widget.right_margin = padding[1];
      this.widget.bottom_margin = padding[2];
      this.widget.left_margin = padding[3];
    }
  }

  getCursorPosition(): number {
    return this.textBuffer.cursor_position;
  }

  setCursorPosition(position: number) {
    this.textBuffer.place_cursor(
      this.textBuffer.get_iter_at_offset(position),
    );
  }

  updateProps(props: DiffedProps): void {
    this.lifecycle.emitLifecycleEventUpdate(props);
  }

  // #region This widget direct mutations

  appendChild(): void {
    throw new Error("TextArea cannot have children.");
  }

  insertBefore(): void {
    throw new Error("TextArea cannot have children.");
  }

  remove(parent: GjsElement): void {
    parent.notifyChildWillUnmount(this);

    this.lifecycle.emitLifecycleEventBeforeDestroy();

    this.widget.destroy();
  }

  render() {
    this.widget.show_all();
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

  notifyChildWillUnmount() {}

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
}
