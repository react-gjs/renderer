import type React from "react";
import type { WindowElement } from "../gjs-elements";
import type {
  ActionBarElement,
  ActionBarProps,
} from "../gjs-elements/gtk3/action-bar/action-bar";
import type { BoxElement, BoxProps } from "../gjs-elements/gtk3/box/box";
import type {
  ButtonBoxElement,
  ButtonBoxProps,
} from "../gjs-elements/gtk3/button-box/button-box";
import type {
  ButtonGroupElement,
  ButtonGroupProps,
} from "../gjs-elements/gtk3/button-group/button-group";
import type {
  ButtonElement,
  ButtonProps,
} from "../gjs-elements/gtk3/button/button";
import type {
  CheckButtonElement,
  CheckButtonProps,
} from "../gjs-elements/gtk3/check-button/check-button";
import type {
  ExpanderElement,
  ExpanderProps,
} from "../gjs-elements/gtk3/expander/expander";
import type {
  FlowBoxElement,
  FlowBoxProps,
} from "../gjs-elements/gtk3/flow-box/flow-box";
import type {
  FlowBoxEntryElement,
  FlowBoxEntryProps,
} from "../gjs-elements/gtk3/flow-box/flow-box-entry";
import type {
  FrameElement,
  FrameProps,
} from "../gjs-elements/gtk3/frame/frame";
import type { GridElement, GridProps } from "../gjs-elements/gtk3/grid/grid";
import type {
  GridItemElement,
  GridItemProps,
} from "../gjs-elements/gtk3/grid/grid-item";
import type {
  ImageElement,
  ImageProps,
} from "../gjs-elements/gtk3/image/image";
import type {
  LabelElement,
  LabelProps,
} from "../gjs-elements/gtk3/label/label";
import type {
  LinkButtonElement,
  LinkButtonProps,
} from "../gjs-elements/gtk3/link-button/link-button";
import type {
  MarkupElement,
  MarkupProps,
} from "../gjs-elements/gtk3/markup/markup";
import type { MBoldProps } from "../gjs-elements/gtk3/markup/markup-elements/b";
import type { MBigProps } from "../gjs-elements/gtk3/markup/markup-elements/big";
import type { MItalicProps } from "../gjs-elements/gtk3/markup/markup-elements/i";
import type { MStrikethroughProps } from "../gjs-elements/gtk3/markup/markup-elements/s";
import type { MSmallProps } from "../gjs-elements/gtk3/markup/markup-elements/small";
import type { MSpanProps } from "../gjs-elements/gtk3/markup/markup-elements/span";
import type { MSubProps } from "../gjs-elements/gtk3/markup/markup-elements/sub";
import type { MSupProps } from "../gjs-elements/gtk3/markup/markup-elements/sup";
import type { MMonospaceProps } from "../gjs-elements/gtk3/markup/markup-elements/tt";
import type { MUnderlineProps } from "../gjs-elements/gtk3/markup/markup-elements/u";
import type {
  NumberInputElement,
  NumberInputProps,
} from "../gjs-elements/gtk3/number-input/number-input";
import type {
  PressableElement,
  PressableProps,
} from "../gjs-elements/gtk3/pressable/pressable";
import type {
  RadioBoxElement,
  RadioBoxProps,
} from "../gjs-elements/gtk3/radio/radio-box";
import type {
  RadioButtonElement,
  RadioButtonProps,
} from "../gjs-elements/gtk3/radio/radio-button";
import type {
  RevealerElement,
  RevealerProps,
} from "../gjs-elements/gtk3/revealer/revealer";
import type {
  ScrollBoxElement,
  ScrollBoxProps,
} from "../gjs-elements/gtk3/scroll-box/scroll-box";
import type {
  SelectorElement,
  SelectorProps,
} from "../gjs-elements/gtk3/selector/selector";
import type {
  SeparatorElement,
  SeparatorProps,
} from "../gjs-elements/gtk3/separator/separator";
import type {
  SizeGroupBoxElement,
  SizeGroupBoxProps,
} from "../gjs-elements/gtk3/size-group-box/size-group-box";
import type {
  SpinnerElement,
  SpinnerProps,
} from "../gjs-elements/gtk3/spinner/spinner";
import type {
  StackScreenElement,
  StackScreenProps,
} from "../gjs-elements/gtk3/stack/stack-screen";
import type {
  SwitchElement,
  SwitchProps,
} from "../gjs-elements/gtk3/switch/switch";
import type {
  TextAreaElement,
  TextAreaProps,
} from "../gjs-elements/gtk3/text-area/text-area";
import type {
  TextEntryElement,
  TextEntryProps,
} from "../gjs-elements/gtk3/text-entry/text-entry";
import type {
  ToolbarElement,
  ToolbarProps,
} from "../gjs-elements/gtk3/toolbar/toolbar";
import type {
  ToolbarButtonElement,
  ToolbarButtonProps,
} from "../gjs-elements/gtk3/toolbar/toolbar-button";
import type {
  ToolbarItemElement,
  ToolbarItemProps,
} from "../gjs-elements/gtk3/toolbar/toolbar-item";
import type {
  ToolbarRadioButtonElement,
  ToolbarRadioButtonProps,
} from "../gjs-elements/gtk3/toolbar/toolbar-radio-button";
import type {
  ToolbarSeparatorElement,
  ToolbarSeparatorProps,
} from "../gjs-elements/gtk3/toolbar/toolbar-separator";
import type {
  ToolbarToggleButtonElement,
  ToolbarToggleButtonProps,
} from "../gjs-elements/gtk3/toolbar/toolbar-toggle-button";
import type { WindowProps } from "../gjs-elements/gtk3/window/window";

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
      TOOLBAR: IntrinsicComponent<
        ComponentWithChildren<ToolbarProps>,
        ToolbarElement
      >;
      TOOLBAR_BUTTON: IntrinsicComponent<
        ComponentWithChildren<ToolbarButtonProps>,
        ToolbarButtonElement
      >;
      TOOLBAR_ITEM: IntrinsicComponent<
        ComponentWithChildren<ToolbarItemProps>,
        ToolbarItemElement
      >;
      TOOLBAR_RADIO_BUTTON: IntrinsicComponent<
        ComponentWithChildren<ToolbarRadioButtonProps, string>,
        ToolbarRadioButtonElement
      >;
      TOOLBAR_SEPARATOR: IntrinsicComponent<
        ToolbarSeparatorProps,
        ToolbarSeparatorElement
      >;
      TOOLBAR_TOGGLE_BUTTON: IntrinsicComponent<
        ComponentWithChildren<ToolbarToggleButtonProps, string>,
        ToolbarToggleButtonElement
      >;
      WINDOW: IntrinsicComponent<
        ComponentWithChildren<WindowProps>,
        WindowElement
      >;
    }
  }
}
