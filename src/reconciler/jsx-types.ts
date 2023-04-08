import type React from "react";
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
  HeaderBarElement,
  HeaderBarProps,
} from "../gjs-elements/gtk3/headerbar/headerbar";
import type { IconElement, IconProps } from "../gjs-elements/gtk3/icon/icon";
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
import type {
  MAnchorElement,
  MAnchorProps,
} from "../gjs-elements/gtk3/markup/markup-elements/a";
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
  MenuBarElement,
  MenuBarProps,
} from "../gjs-elements/gtk3/menu-bar/menu-bar";
import type {
  MenuBarItemElement,
  MenuBarItemProps,
} from "../gjs-elements/gtk3/menu-bar/menu-bar-item";
import type {
  MenuCheckButtonElement,
  MenuCheckButtonProps,
} from "../gjs-elements/gtk3/menu-bar/menu-check-button";
import type {
  MenuEntryElement,
  MenuEntryProps,
} from "../gjs-elements/gtk3/menu-bar/menu-entry";
import type {
  MenuRadioButtonElement,
  MenuRadioButtonProps,
} from "../gjs-elements/gtk3/menu-bar/menu-radio-button";
import type {
  MenuSeparatorElement,
  MenuSeparatorProps,
} from "../gjs-elements/gtk3/menu-bar/menu-separator";
import type {
  ModelButtonElement,
  ModelButtonProps,
} from "../gjs-elements/gtk3/model-button/model-button";
import type {
  NumberInputElement,
  NumberInputProps,
} from "../gjs-elements/gtk3/number-input/number-input";
import type {
  PopoverMenuCheckButtonElement,
  PopoverMenuCheckButtonProps,
} from "../gjs-elements/gtk3/popover-menu/content-elements/popover-menu-check-button";
import type {
  PopoverMenuEntryElement,
  PopoverMenuEntryProps,
} from "../gjs-elements/gtk3/popover-menu/content-elements/popover-menu-entry";
import type {
  PopoverMenuItemElement,
  PopoverMenuItemProps,
} from "../gjs-elements/gtk3/popover-menu/content-elements/popover-menu-item";
import type {
  PopoverMenuRadioButtonElement,
  PopoverMenuRadioButtonProps,
} from "../gjs-elements/gtk3/popover-menu/content-elements/popover-menu-radio-button";
import type {
  PopoverMenuSeparatorElement,
  PopoverMenuSeparatorProps,
} from "../gjs-elements/gtk3/popover-menu/content-elements/popover-menu-separator";
import type {
  PressableElement,
  PressableProps,
} from "../gjs-elements/gtk3/pressable/pressable";
import type {
  RadioButtonElement,
  RadioButtonProps,
} from "../gjs-elements/gtk3/radio/radio-button";
import type {
  RadioGroupElement,
  RadioGroupProps,
} from "../gjs-elements/gtk3/radio/radio-group";
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
  SliderPopupButtonElement,
  SliderPopupButtonProps,
} from "../gjs-elements/gtk3/slider-popup-button/slider-popup-button";
import type {
  SliderElement,
  SliderProps,
} from "../gjs-elements/gtk3/slider/slider";
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
  TextViewElement,
  TextViewProps,
} from "../gjs-elements/gtk3/text-view/text-view";
import type {
  TextViewImageElement,
  TextViewImageProps,
} from "../gjs-elements/gtk3/text-view/text-view-elements/text-view-image";
import type {
  TextViewLinkElement,
  TextViewLinkProps,
} from "../gjs-elements/gtk3/text-view/text-view-elements/text-view-link";
import type {
  TextViewSpanElement,
  TextViewSpanProps,
} from "../gjs-elements/gtk3/text-view/text-view-elements/text-view-span";
import type {
  TextViewWidgetElement,
  TextViewWidgetProps,
} from "../gjs-elements/gtk3/text-view/text-view-elements/text-view-widget";
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
import type {
  VolumeButtonElement,
  VolumeButtonProps,
} from "../gjs-elements/gtk3/volume-button/volume-button";
import type { WindowProps } from "../gjs-elements/gtk3/window/window";
import type { WindowElement } from "../gjs-elements/rg-types";

declare global {
  namespace Rg {
    type ComponentWithChildren<
      P,
      C extends React.ReactNode = React.ReactNode
    > = {
      children?: C | C[];
    } & P;

    type ComponentWithChild<P, C extends React.ReactNode = React.ReactNode> = {
      children?: C;
    } & P;

    type IntrinsicComponent<P, W> = {
      ref?:
        | {
            current: W | null;
          }
        | ((ref: W | null) => void);
    } & P;
  }

  namespace JSX {
    interface IntrinsicElements {
      ACTION_BAR: Rg.IntrinsicComponent<
        Rg.ComponentWithChildren<ActionBarProps>,
        ActionBarElement
      >;
      BOX: Rg.IntrinsicComponent<
        Rg.ComponentWithChildren<BoxProps>,
        BoxElement
      >;
      BUTTON: Rg.IntrinsicComponent<
        Rg.ComponentWithChildren<ButtonProps, string>,
        ButtonElement
      >;
      BUTTON_BOX: Rg.IntrinsicComponent<
        Rg.ComponentWithChildren<ButtonBoxProps>,
        ButtonBoxElement
      >;
      BUTTON_GROUP: Rg.IntrinsicComponent<
        Rg.ComponentWithChildren<ButtonGroupProps>,
        ButtonGroupElement
      >;
      CHECK_BUTTON: Rg.IntrinsicComponent<
        Rg.ComponentWithChild<CheckButtonProps, string>,
        CheckButtonElement
      >;
      EXPANDER: Rg.IntrinsicComponent<
        Rg.ComponentWithChildren<ExpanderProps>,
        ExpanderElement
      >;
      FLOW_BOX: Rg.IntrinsicComponent<
        Rg.ComponentWithChildren<FlowBoxProps>,
        FlowBoxElement
      >;
      FLOW_BOX_ENTRY: Rg.IntrinsicComponent<
        Rg.ComponentWithChildren<FlowBoxEntryProps>,
        FlowBoxEntryElement
      >;
      FRAME: Rg.IntrinsicComponent<
        Rg.ComponentWithChildren<FrameProps>,
        FrameElement
      >;
      GRID: Rg.IntrinsicComponent<
        Rg.ComponentWithChildren<GridProps>,
        GridElement
      >;
      GRID_ITEM: Rg.IntrinsicComponent<
        Rg.ComponentWithChild<GridItemProps, React.ReactElement>,
        GridItemElement
      >;
      HEADER_BAR: Rg.IntrinsicComponent<
        Rg.ComponentWithChildren<HeaderBarProps>,
        HeaderBarElement
      >;
      ICON: Rg.IntrinsicComponent<
        Rg.ComponentWithChildren<IconProps, string>,
        IconElement
      >;
      IMAGE: Rg.IntrinsicComponent<ImageProps, ImageElement>;
      LABEL: Rg.IntrinsicComponent<
        Rg.ComponentWithChildren<LabelProps, string>,
        LabelElement
      >;
      LINK_BUTTON: Rg.IntrinsicComponent<
        Rg.ComponentWithChildren<LinkButtonProps, string>,
        LinkButtonElement
      >;
      MARKUP: Rg.IntrinsicComponent<
        Rg.ComponentWithChildren<MarkupProps, string | React.ReactNode>,
        MarkupElement
      >;
      M_ANCHOR: Rg.IntrinsicComponent<
        Rg.ComponentWithChildren<MAnchorProps, string | React.ReactNode>,
        MAnchorElement
      >;
      M_BIG: Rg.ComponentWithChildren<MBigProps, string | React.ReactNode>;
      M_BOLD: Rg.ComponentWithChildren<MBoldProps, string | React.ReactNode>;
      M_ITALIC: Rg.ComponentWithChildren<
        MItalicProps,
        string | React.ReactNode
      >;
      M_MONOSPACE: Rg.ComponentWithChildren<
        MMonospaceProps,
        string | React.ReactNode
      >;
      M_SMALL: Rg.ComponentWithChildren<MSmallProps, string | React.ReactNode>;
      M_SPAN: Rg.ComponentWithChildren<MSpanProps, string | React.ReactNode>;
      M_STRIKETHROUGH: Rg.ComponentWithChildren<
        MStrikethroughProps,
        string | React.ReactNode
      >;
      M_SUBSCRIPT: Rg.ComponentWithChildren<
        MSubProps,
        string | React.ReactNode
      >;
      M_SUPERSCRIPT: Rg.ComponentWithChildren<
        MSupProps,
        string | React.ReactNode
      >;
      M_UNDERLINE: Rg.ComponentWithChildren<
        MUnderlineProps,
        string | React.ReactNode
      >;
      MENU_BAR: Rg.IntrinsicComponent<
        Rg.ComponentWithChildren<MenuBarProps>,
        MenuBarElement
      >;
      MENU_BAR_ITEM: Rg.IntrinsicComponent<
        Rg.ComponentWithChildren<MenuBarItemProps>,
        MenuBarItemElement
      >;
      MENU_CHECK_BUTTON: Rg.IntrinsicComponent<
        MenuCheckButtonProps,
        MenuCheckButtonElement
      >;
      MENU_ENTRY: Rg.IntrinsicComponent<
        Rg.ComponentWithChildren<MenuEntryProps>,
        MenuEntryElement
      >;
      MENU_RADIO_BUTTON: Rg.IntrinsicComponent<
        MenuRadioButtonProps,
        MenuRadioButtonElement
      >;
      MENU_SEPARATOR: Rg.IntrinsicComponent<
        MenuSeparatorProps,
        MenuSeparatorElement
      >;
      MODEL_BUTTON: Rg.IntrinsicComponent<
        Rg.ComponentWithChildren<ModelButtonProps, string>,
        ModelButtonElement
      >;
      NUMBER_INPUT: Rg.IntrinsicComponent<NumberInputProps, NumberInputElement>;
      PRESSABLE: Rg.IntrinsicComponent<
        Rg.ComponentWithChild<PressableProps, React.ReactElement>,
        PressableElement
      >;
      POPOVER_MENU_ENTRY: Rg.IntrinsicComponent<
        Rg.ComponentWithChildren<PopoverMenuEntryProps>,
        PopoverMenuEntryElement
      >;
      POPOVER_MENU_ITEM: Rg.IntrinsicComponent<
        Rg.ComponentWithChild<PopoverMenuItemProps>,
        PopoverMenuItemElement
      >;
      POPOVER_MENU_CHECK_BUTTON: Rg.IntrinsicComponent<
        PopoverMenuCheckButtonProps,
        PopoverMenuCheckButtonElement
      >;
      POPOVER_MENU_RADIO_BUTTON: Rg.IntrinsicComponent<
        PopoverMenuRadioButtonProps,
        PopoverMenuRadioButtonElement
      >;
      POPOVER_MENU_SEPARATOR: Rg.IntrinsicComponent<
        PopoverMenuSeparatorProps,
        PopoverMenuSeparatorElement
      >;
      RADIO_GROUP: Rg.IntrinsicComponent<
        Rg.ComponentWithChildren<RadioGroupProps>,
        RadioGroupElement
      >;
      RADIO_BUTTON: Rg.IntrinsicComponent<RadioButtonProps, RadioButtonElement>;
      REVEALER: Rg.IntrinsicComponent<
        Rg.ComponentWithChildren<RevealerProps>,
        RevealerElement
      >;
      SCROLL_BOX: Rg.IntrinsicComponent<
        Rg.ComponentWithChild<ScrollBoxProps, React.ReactElement>,
        ScrollBoxElement
      >;
      SELECTOR: Rg.IntrinsicComponent<SelectorProps, SelectorElement>;
      SEPARATOR: Rg.IntrinsicComponent<SeparatorProps, SeparatorElement>;
      SIZE_GROUP_BOX: Rg.IntrinsicComponent<
        Rg.ComponentWithChildren<SizeGroupBoxProps>,
        SizeGroupBoxElement
      >;
      SLIDER_POPUP_BUTTON: Rg.IntrinsicComponent<
        Rg.ComponentWithChildren<SliderPopupButtonProps>,
        SliderPopupButtonElement
      >;
      SLIDER: Rg.IntrinsicComponent<SliderProps, SliderElement>;
      SPINNER: Rg.IntrinsicComponent<SpinnerProps, SpinnerElement>;
      STACK_SCREEN: Rg.IntrinsicComponent<
        Rg.ComponentWithChildren<StackScreenProps>,
        StackScreenElement
      >;
      SWITCH: Rg.IntrinsicComponent<SwitchProps, SwitchElement>;
      TEXT_AREA: Rg.IntrinsicComponent<TextAreaProps, TextAreaElement>;
      TEXT_ENTRY: Rg.IntrinsicComponent<TextEntryProps, TextEntryElement>;
      TEXT_VIEW: Rg.IntrinsicComponent<
        Rg.ComponentWithChildren<TextViewProps>,
        TextViewElement
      >;
      TEXT_VIEW_IMAGE: Rg.IntrinsicComponent<
        TextViewImageProps,
        TextViewImageElement
      >;
      TEXT_VIEW_LINK: Rg.IntrinsicComponent<
        Rg.ComponentWithChildren<TextViewLinkProps>,
        TextViewLinkElement
      >;
      TEXT_VIEW_SPAN: Rg.IntrinsicComponent<
        Rg.ComponentWithChildren<TextViewSpanProps>,
        TextViewSpanElement
      >;
      TEXT_VIEW_WIDGET: Rg.IntrinsicComponent<
        Rg.ComponentWithChildren<TextViewWidgetProps>,
        TextViewWidgetElement
      >;
      TOOLBAR: Rg.IntrinsicComponent<
        Rg.ComponentWithChildren<ToolbarProps>,
        ToolbarElement
      >;
      TOOLBAR_BUTTON: Rg.IntrinsicComponent<
        Rg.ComponentWithChildren<ToolbarButtonProps>,
        ToolbarButtonElement
      >;
      TOOLBAR_ITEM: Rg.IntrinsicComponent<
        Rg.ComponentWithChildren<ToolbarItemProps>,
        ToolbarItemElement
      >;
      TOOLBAR_RADIO_BUTTON: Rg.IntrinsicComponent<
        Rg.ComponentWithChildren<ToolbarRadioButtonProps, string>,
        ToolbarRadioButtonElement
      >;
      TOOLBAR_SEPARATOR: Rg.IntrinsicComponent<
        ToolbarSeparatorProps,
        ToolbarSeparatorElement
      >;
      TOOLBAR_TOGGLE_BUTTON: Rg.IntrinsicComponent<
        Rg.ComponentWithChildren<ToolbarToggleButtonProps, string>,
        ToolbarToggleButtonElement
      >;
      VOLUME_BUTTON: Rg.IntrinsicComponent<
        Rg.ComponentWithChildren<VolumeButtonProps, string>,
        VolumeButtonElement
      >;
      WINDOW: Rg.IntrinsicComponent<
        Rg.ComponentWithChildren<WindowProps>,
        WindowElement
      >;
    }
  }
}
