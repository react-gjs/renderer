import React from "react";
import { SearchBarContext } from "./components/search-bar/search-bar";
import { WindowContext } from "./components/window/window";
import type { CustomWidgetElement, CustomWidgetProps } from "./gjs-elements/gtk3/custom-widget/custom-widget";
import { PopoverMenu } from "./gjs-elements/gtk3/popover-menu/component";
import { Popover } from "./gjs-elements/gtk3/popover/component";
import { markAsIntrinsic } from "./utils/intrinsic-marker";
import { mapContextToProps } from "./utils/map-context-to-props";

const IntrinsicElem = <E extends keyof JSX.IntrinsicElements>(
  v: E,
) => {
  const c = mapContextToProps(v)
    .mapCtx(WindowContext, (w) => ({
      __rg_parent_window: w,
    }))
    .addMiddleware((component) => {
      return markAsIntrinsic(component, v);
    });

  return c;
};

/** Equivalent to the Gtk.ActionBar widget. */
export const ActionBar = IntrinsicElem("ACTION_BAR").component();
/** Equivalent to the Gtk.Box widget. */
export const Box = IntrinsicElem("BOX").component();
/**
 * Equivalent to the Gtk.Button widget. Only accepts strings as
 * children.
 */
export const Button = IntrinsicElem("BUTTON").component();
/**
 * Equivalent to the Gtk.Button widget. Only accepts other React
 * elements as children.
 */
export const ButtonBox = IntrinsicElem("BUTTON_BOX").component();
/** Equivalent to the Gtk.ButtonBox widget. */
export const ButtonGroup = IntrinsicElem("BUTTON_GROUP").component();
/** Equivalent to the Gtk.CheckButton widget. */
export const CheckButton = IntrinsicElem("CHECK_BUTTON").component();
/** Equivalent to the Gtk.ColorButton widget. */
export const ColorButton = IntrinsicElem("COLOR_BUTTON").component();
/** Equivalent to the Gtk.Expander widget. */
export const Expander = IntrinsicElem("EXPANDER").component();
/** Equivalent to the Gtk.FlexBox widget. */
export const FlowBox = IntrinsicElem("FLOW_BOX").component();
/** Equivalent to the Gtk.FlexBoxChild widget. */
export const FlowBoxEntry = IntrinsicElem("FLOW_BOX_ENTRY").component();
/** Equivalent to the Gtk.Frame widget. */
export const Frame = IntrinsicElem("FRAME").component();
/** Equivalent to the Gtk.Grid widget. */
export const Grid = IntrinsicElem("GRID").component();
/** A component that must wrap each child of a `<Grid />`. */
export const GridItem = IntrinsicElem("GRID_ITEM").component();
/** Equivalent to the Gtk.HeaderBar widget. */
export const HeaderBar = IntrinsicElem("HEADER_BAR").component();
/** Equivalent to the Gtk.Button widget. */
export const Label = IntrinsicElem("LABEL").component();
/** Equivalent to the Gtk.LevelBar widget. */
export const LevelBar = IntrinsicElem("LEVEL_BAR").component();
/** Equivalent to the Gtk.LinkButton widget. */
export const LinkButton = IntrinsicElem("LINK_BUTTON").component();
/** Equivalent to the Gtk.MenuBar widget. */
export const MenuBar = IntrinsicElem("MENU_BAR").component();
/** Equivalent to the Gtk.MenuItem widget. */
export const MenuBarItem = IntrinsicElem("MENU_BAR_ITEM").component();
/** Equivalent to the Gtk.CheckMenuItem widget. */
export const MenuCheckButton = IntrinsicElem(
  "MENU_CHECK_BUTTON",
).component();
/** Equivalent to the Gtk.MenuItem widget. */
export const MenuEntry = IntrinsicElem("MENU_ENTRY").component();
/** Equivalent to the Gtk.RadioMenuItem widget. */
export const MenuRadioButton = IntrinsicElem(
  "MENU_RADIO_BUTTON",
).component();
/** Equivalent to the Gtk.SeparatorMenuItem widget. */
export const MenuSeparator = IntrinsicElem("MENU_SEPARATOR").component();
/** Equivalent to the Gtk.ModelButton widget. */
export const ModelButton = IntrinsicElem("MODEL_BUTTON").component();
/** Equivalent to the Gtk.SpinButton widget. */
export const NumberInput = IntrinsicElem("NUMBER_INPUT").component();
/** Equivalent to the Gtk.Image widget. */
export const Icon = IntrinsicElem("ICON").component();
/** Equivalent to the Gtk.Image widget. */
export const Image = IntrinsicElem("IMAGE").component();
/** Equivalent to the Gtk.Paned widget. */
export const Paned = IntrinsicElem("PANED").component();
/** Equivalent to the Gtk.EventBox widget. */
export const Pressable = IntrinsicElem("PRESSABLE").component();
/** Equivalent to the Gtk.ModelButton widget. */
export const PopoverMenuEntry = IntrinsicElem(
  "POPOVER_MENU_ENTRY",
).component();
/**
 * A general use container that can be used within popover menus.
 * Equivalent to the Gtk.Bin widget.
 */
export const PopoverMenuItem = IntrinsicElem(
  "POPOVER_MENU_ITEM",
).component();
/** Equivalent to the Gtk.ModelButton widget. */
export const PopoverMenuCheckButton = IntrinsicElem(
  "POPOVER_MENU_CHECK_BUTTON",
).component();
/** Equivalent to the Gtk.ModelButton widget. */
export const PopoverMenuRadioButton = IntrinsicElem(
  "POPOVER_MENU_RADIO_BUTTON",
).component();
/** Equivalent to the Gtk.Separator widget. */
export const PopoverMenuSeparator = IntrinsicElem(
  "POPOVER_MENU_SEPARATOR",
).component();
/** Equivalent to the Gtk.ProgressBar widget. */
export const ProgressBar = IntrinsicElem("PROGRESS_BAR").component();
/** Equivalent to the Gtk.Box widget. */
export const RadioBox = IntrinsicElem("RADIO_GROUP").component();
/** Equivalent to the Gtk.RadioButton widget. */
export const RadioButton = IntrinsicElem("RADIO_BUTTON").component();
/** Equivalent to the Gtk.Revealer widget. */
export const Revealer = IntrinsicElem("REVEALER").component();
/** Equivalent to the Gtk.ScrolledWindow widget. */
export const ScrollBox = IntrinsicElem("SCROLL_BOX").component();
/** Built on top of the Gtk.ComboBox widget. */
export const Selector = IntrinsicElem("SELECTOR").component();
/** Equivalent to the Gtk.Separator widget. */
export const Separator = IntrinsicElem("SEPARATOR").component();
/** Equivalent to the Gtk.Spinner widget. */
export const Spinner = IntrinsicElem("SPINNER").component();
/** Built on top of Gtk.Box and Gtk.SizeGroup. */
export const SizeGroupBox = IntrinsicElem("SIZE_GROUP_BOX").component();
/** Equivalent to the Gtk.ScaleButton widget. */
export const SliderPopupButton = IntrinsicElem(
  "SLIDER_POPUP_BUTTON",
).component();
/** Equivalent to the Gtk.Scale widget. */
export const Slider = IntrinsicElem("SLIDER").component();
/**
 * Equivalent to the Gtk.Box widget. Specifically made to add items to
 * a Stack.
 */
export const StackScreen = IntrinsicElem("STACK_SCREEN").component();
/** Equivalent to the Gtk.Switch widget. */
export const Switch = IntrinsicElem("SWITCH").component();
/** Equivalent to the Gtk.TextView widget. */
export const TextArea = IntrinsicElem("TEXT_AREA").component();
/** Equivalent to the Gtk.Entry widget. */
export const TextInput = IntrinsicElem("TEXT_ENTRY").component();
/** Equivalent to the Gtk.Toolbar widget. */
export const Toolbar = IntrinsicElem("TOOLBAR").component();
/** Equivalent to the Gtk.ToolButton widget. */
export const ToolbarButton = IntrinsicElem("TOOLBAR_BUTTON").component();
/** Equivalent to the Gtk.ToolItem widget. */
export const ToolbarItem = IntrinsicElem("TOOLBAR_ITEM").component();
/** Equivalent to the Gtk.RadioToolButton widget. */
export const ToolbarRadioButton = IntrinsicElem(
  "TOOLBAR_RADIO_BUTTON",
).component();
/** Equivalent to the Gtk.ToggleToolButton widget. */
export const ToolbarToggleButton = IntrinsicElem(
  "TOOLBAR_TOGGLE_BUTTON",
).component();
/** Equivalent to the Gtk.ToolSeparator widget. */
export const ToolbarSeparator = IntrinsicElem(
  "TOOLBAR_SEPARATOR",
).component();
/** Equivalent to the Gtk.VolumeButton widget. */
export const VolumeButton = IntrinsicElem("VOLUME_BUTTON").component();

export const SearchInput = IntrinsicElem("SEARCH_INPUT")
  .mapCtx(SearchBarContext, (b) => ({
    __rg_search_bar: b.searchBar,
  }))
  .component();

markAsIntrinsic(Popover, "POPOVER");
markAsIntrinsic(PopoverMenu, "POPOVER_MENU");

export { createStack, useStack } from "./gjs-elements/gtk3/stack/use-stack";
export { Popover, PopoverMenu };

// region TextView

/** Equivalent to the Gtk.TextView widget. */
export const TextView = IntrinsicElem("TEXT_VIEW").component();
/** A TextView Element, must be used inside a `<TextView />`. */
export const TextViewImage = IntrinsicElem("TEXT_VIEW_IMAGE").component();
/** A TextView Element, must be used inside a `<TextView />`. */
export const TextViewLink = IntrinsicElem("TEXT_VIEW_LINK").component();
/** A TextView Element, must be used inside a `<TextView />`. */
export const TextViewSpan = IntrinsicElem("TEXT_VIEW_SPAN").component();
/** A TextView Element, must be used inside a `<TextView />`. */
export const TextViewWidget = IntrinsicElem(
  "TEXT_VIEW_WIDGET",
).component();

// endregion

// #region Markup

/**
 * Equivalent to the Gtk.Label widget. Allows to use a Pango Markup
 * syntax for displaying text.
 */
export const Markup = IntrinsicElem("MARKUP").component();
/** A Markup element. Must be used inside a `<Markup />`. */
export const Anchor = IntrinsicElem("M_ANCHOR").component();
/** A Markup element. Must be used inside a `<Markup />`. */
export const Span = IntrinsicElem("M_SPAN").component();
/** A Markup element. Must be used inside a `<Markup />`. */
export const Big = IntrinsicElem("M_BIG").component();
/** A Markup element. Must be used inside a `<Markup />`. */
export const Bold = IntrinsicElem("M_BOLD").component();
/** A Markup element. Must be used inside a `<Markup />`. */
export const Italic = IntrinsicElem("M_ITALIC").component();
/** A Markup element. Must be used inside a `<Markup />`. */
export const Monospace = IntrinsicElem("M_MONOSPACE").component();
/** A Markup element. Must be used inside a `<Markup />`. */
export const Small = IntrinsicElem("M_SMALL").component();
/** A Markup element. Must be used inside a `<Markup />`. */
export const Strike = IntrinsicElem("M_STRIKETHROUGH").component();
/** A Markup element. Must be used inside a `<Markup />`. */
export const Sub = IntrinsicElem("M_SUBSCRIPT").component();
/** A Markup element. Must be used inside a `<Markup />`. */
export const Sup = IntrinsicElem("M_SUPERSCRIPT").component();
/** A Markup element. Must be used inside a `<Markup />`. */
export const Underline = IntrinsicElem("M_UNDERLINE").component();

// #endregion

// #region CustomWidget

export const CustomWidget: <P extends object>(
  props: Rg.IntrinsicComponent<
    CustomWidgetProps<P>,
    CustomWidgetElement
  >,
) => JSX.Element = React.forwardRef<any, React.PropsWithChildren>(
  (props, ref): JSX.Element => {
    return React.createElement("CUSTOM_WIDGET", { ...props, ref });
  },
) as any;

markAsIntrinsic(CustomWidget, "CUSTOM_WIDGET");
