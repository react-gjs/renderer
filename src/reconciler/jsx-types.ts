import type React from "react";
import type {
  ActionBarElement,
  ActionBarProps,
} from "../gjs-elements/action-bar/action-bar";
import type { BoxElement, BoxProps } from "../gjs-elements/box/box";
import type {
  ButtonBoxElement,
  ButtonBoxProps,
} from "../gjs-elements/button-box/button-box";
import type {
  ButtonGroupElement,
  ButtonGroupProps,
} from "../gjs-elements/button-group/button-group";
import type { ButtonElement, ButtonProps } from "../gjs-elements/button/button";
import type {
  CheckButtonElement,
  CheckButtonProps,
} from "../gjs-elements/check-button/check-button";
import type {
  ExpanderElement,
  ExpanderProps,
} from "../gjs-elements/expander/expander";
import type {
  FlowBoxElement,
  FlowBoxProps,
} from "../gjs-elements/flow-box/flow-box";
import type {
  FlowBoxEntryElement,
  FlowBoxEntryProps,
} from "../gjs-elements/flow-box/flow-box-entry";
import type { FrameElement, FrameProps } from "../gjs-elements/frame/frame";
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
  NumberInputElement,
  NumberInputProps,
} from "../gjs-elements/number-input/number-input";
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
  RevealerElement,
  RevealerProps,
} from "../gjs-elements/revealer/revealer";
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
  SizeGroupBoxElement,
  SizeGroupBoxProps,
} from "../gjs-elements/size-group-box/size-group-box";
import type {
  SpinnerElement,
  SpinnerProps,
} from "../gjs-elements/spinner/spinner";
import type {
  StackScreenElement,
  StackScreenProps,
} from "../gjs-elements/stack/stack-screen";
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

export type ComponentWithChildren<
  P,
  C extends React.ReactNode = React.ReactNode
> = {
  children?: C | C[];
} & P;

export type ComponentWithChild<
  P,
  C extends React.ReactNode = React.ReactNode
> = {
  children?: C;
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
      ACTION_BAR: IntrinsicComponent<
        ComponentWithChildren<ActionBarProps>,
        ActionBarElement
      >;
      BOX: IntrinsicComponent<ComponentWithChildren<BoxProps>, BoxElement>;
      BUTTON: IntrinsicComponent<
        ComponentWithChildren<ButtonProps, string>,
        ButtonElement
      >;
      BUTTON_BOX: IntrinsicComponent<
        ComponentWithChildren<ButtonBoxProps>,
        ButtonBoxElement
      >;
      BUTTON_GROUP: IntrinsicComponent<
        ComponentWithChildren<ButtonGroupProps>,
        ButtonGroupElement
      >;
      CHECK_BUTTON: IntrinsicComponent<
        ComponentWithChild<CheckButtonProps, string>,
        CheckButtonElement
      >;
      EXPANDER: IntrinsicComponent<
        ComponentWithChildren<ExpanderProps>,
        ExpanderElement
      >;
      FLOW_BOX: IntrinsicComponent<
        ComponentWithChildren<FlowBoxProps>,
        FlowBoxElement
      >;
      FLOW_BOX_ENTRY: IntrinsicComponent<
        ComponentWithChildren<FlowBoxEntryProps>,
        FlowBoxEntryElement
      >;
      FRAME: IntrinsicComponent<
        ComponentWithChildren<FrameProps>,
        FrameElement
      >;
      GRID: IntrinsicComponent<ComponentWithChildren<GridProps>, GridElement>;
      GRID_ITEM: IntrinsicComponent<
        ComponentWithChild<GridItemProps, React.ReactElement>,
        GridItemElement
      >;
      IMAGE: IntrinsicComponent<ImageProps, ImageElement>;
      LABEL: IntrinsicComponent<
        ComponentWithChildren<LabelProps, string>,
        LabelElement
      >;
      LINK_BUTTON: IntrinsicComponent<
        ComponentWithChildren<LinkButtonProps, string>,
        LinkButtonElement
      >;
      MARKUP: IntrinsicComponent<
        ComponentWithChildren<MarkupProps, string | React.ReactElement>,
        MarkupElement
      >;
      M_BIG: ComponentWithChildren<MBigProps, string>;
      M_BOLD: ComponentWithChildren<MBoldProps, string>;
      M_ITALIC: ComponentWithChildren<MItalicProps, string>;
      M_MONOSPACE: ComponentWithChildren<MMonospaceProps, string>;
      M_SMALL: ComponentWithChildren<MSmallProps, string>;
      M_SPAN: ComponentWithChildren<MSpanProps, string>;
      M_STRIKETHROUGH: ComponentWithChildren<MStrikethroughProps, string>;
      M_SUBSCRIPT: ComponentWithChildren<MSubProps, string>;
      M_SUPERSCRIPT: ComponentWithChildren<MSupProps, string>;
      M_UNDERLINE: ComponentWithChildren<MUnderlineProps, string>;
      NUMBER_INPUT: IntrinsicComponent<NumberInputProps, NumberInputElement>;
      PRESSABLE: IntrinsicComponent<
        ComponentWithChild<PressableProps, React.ReactElement>,
        PressableElement
      >;
      RADIO_BOX: IntrinsicComponent<
        ComponentWithChildren<RadioBoxProps>,
        RadioBoxElement
      >;
      RADIO_BUTTON: IntrinsicComponent<RadioButtonProps, RadioButtonElement>;
      REVEALER: IntrinsicComponent<
        ComponentWithChildren<RevealerProps>,
        RevealerElement
      >;
      SCROLL_BOX: IntrinsicComponent<
        ComponentWithChild<ScrollBoxProps, React.ReactElement>,
        ScrollBoxElement
      >;
      SELECTOR: IntrinsicComponent<SelectorProps, SelectorElement>;
      SEPARATOR: IntrinsicComponent<SeparatorProps, SeparatorElement>;
      SIZE_GROUP_BOX: IntrinsicComponent<
        ComponentWithChildren<SizeGroupBoxProps>,
        SizeGroupBoxElement
      >;
      SPINNER: IntrinsicComponent<SpinnerProps, SpinnerElement>;
      STACK_SCREEN: IntrinsicComponent<
        ComponentWithChildren<StackScreenProps>,
        StackScreenElement
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
