import type { BoxElement, BoxProps } from "../gjs-elements/box/box";
import type { ButtonElement, ButtonProps } from "../gjs-elements/button/button";
import type {
  CheckButtonElement,
  CheckButtonProps,
} from "../gjs-elements/check-button/check-button";
import type {
  FlowBoxElement,
  FlowBoxProps,
} from "../gjs-elements/flow-box/flow-box";
import type {
  FlowBoxEntryElement,
  FlowBoxEntryProps,
} from "../gjs-elements/flow-box/flow-box-entry";
import type { GridElement, GridProps } from "../gjs-elements/grid/grid";
import type {
  GridItemElement,
  GridItemProps,
} from "../gjs-elements/grid/grid-item";
import type { ImageElement, ImageProps } from "../gjs-elements/image/image";
import type { LabelElement, LabelProps } from "../gjs-elements/label/label";
import type {
  LinkButtonElement,
  LinkButtonProps,
} from "../gjs-elements/link-button/link-button";
import type { MarkupElement, MarkupProps } from "../gjs-elements/markup/markup";
import type { MBoldProps } from "../gjs-elements/markup/markup-elements/b";
import type { MBigProps } from "../gjs-elements/markup/markup-elements/big";
import type { MItalicProps } from "../gjs-elements/markup/markup-elements/i";
import type { MStrikethroughProps } from "../gjs-elements/markup/markup-elements/s";
import type { MSmallProps } from "../gjs-elements/markup/markup-elements/small";
import type { MSpanProps } from "../gjs-elements/markup/markup-elements/span";
import type { MSubProps } from "../gjs-elements/markup/markup-elements/sub";
import type { MSupProps } from "../gjs-elements/markup/markup-elements/sup";
import type { MMonospaceProps } from "../gjs-elements/markup/markup-elements/tt";
import type { MUnderlineProps } from "../gjs-elements/markup/markup-elements/u";
import type {
  PressableElement,
  PressableProps,
} from "../gjs-elements/pressable/pressable";
import type {
  RadioBoxElement,
  RadioBoxProps,
} from "../gjs-elements/radio/radio-box";
import type {
  RadioButtonElement,
  RadioButtonProps,
} from "../gjs-elements/radio/radio-button";
import type {
  ScrollBoxElement,
  ScrollBoxProps,
} from "../gjs-elements/scroll-box/scroll-box";
import type {
  SelectorElement,
  SelectorProps,
} from "../gjs-elements/selector/selector";
import type {
  SeparatorElement,
  SeparatorProps,
} from "../gjs-elements/separator/separator";
import type {
  StackItemElement,
  StackItemProps,
} from "../gjs-elements/stack/stack-item";
import type { SwitchElement, SwitchProps } from "../gjs-elements/switch/switch";
import type {
  TextAreaElement,
  TextAreaProps,
} from "../gjs-elements/text-area/text-area";
import type {
  TextEntryElement,
  TextEntryProps,
} from "../gjs-elements/text-entry/text-entry";
import type { WindowElement, WindowProps } from "../gjs-elements/window/window";

export type ComponentWithChildren<P> = {
  children?: React.ReactNode | React.ReactNode[];
} & P;

export type IntrinsicComponent<P, W> = {
  ref?:
    | {
        current?: W | null;
      }
    | ((ref: W) => void);
} & P;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      BOX: IntrinsicComponent<ComponentWithChildren<BoxProps>, BoxElement>;
      BUTTON: IntrinsicComponent<
        ComponentWithChildren<ButtonProps>,
        ButtonElement
      >;
      CHECK_BUTTON: IntrinsicComponent<CheckButtonProps, CheckButtonElement>;
      FLOW_BOX: IntrinsicComponent<
        ComponentWithChildren<FlowBoxProps>,
        FlowBoxElement
      >;
      FLOW_BOX_ENTRY: IntrinsicComponent<
        ComponentWithChildren<FlowBoxEntryProps>,
        FlowBoxEntryElement
      >;
      GRID: IntrinsicComponent<ComponentWithChildren<GridProps>, GridElement>;
      GRID_ITEM: IntrinsicComponent<GridItemProps, GridItemElement>;
      IMAGE: IntrinsicComponent<ImageProps, ImageElement>;
      LABEL: IntrinsicComponent<
        ComponentWithChildren<LabelProps>,
        LabelElement
      >;
      LINK_BUTTON: IntrinsicComponent<LinkButtonProps, LinkButtonElement>;
      MARKUP: IntrinsicComponent<MarkupProps, MarkupElement>;
      M_BIG: MBigProps;
      M_BOLD: MBoldProps;
      M_ITALIC: MItalicProps;
      M_MONOSPACE: MMonospaceProps;
      M_SMALL: MSmallProps;
      M_SPAN: MSpanProps;
      M_STRIKETHROUGH: MStrikethroughProps;
      M_SUBSCRIPT: MSubProps;
      M_SUPERSCRIPT: MSupProps;
      M_UNDERLINE: MUnderlineProps;
      PRESSABLE: IntrinsicComponent<PressableProps, PressableElement>;
      RADIO_BOX: IntrinsicComponent<
        ComponentWithChildren<RadioBoxProps>,
        RadioBoxElement
      >;
      RADIO_BUTTON: IntrinsicComponent<RadioButtonProps, RadioButtonElement>;
      SCROLL_BOX: IntrinsicComponent<ScrollBoxProps, ScrollBoxElement>;
      SELECTOR: IntrinsicComponent<SelectorProps, SelectorElement>;
      SEPARATOR: IntrinsicComponent<SeparatorProps, SeparatorElement>;
      STACK_ITEM: IntrinsicComponent<
        ComponentWithChildren<StackItemProps>,
        StackItemElement
      >;
      SWITCH: IntrinsicComponent<SwitchProps, SwitchElement>;
      TEXT_AREA: IntrinsicComponent<TextAreaProps, TextAreaElement>;
      TEXT_ENTRY: IntrinsicComponent<TextEntryProps, TextEntryElement>;
      WINDOW: IntrinsicComponent<
        ComponentWithChildren<WindowProps>,
        WindowElement
      >;
    }
  }
}
