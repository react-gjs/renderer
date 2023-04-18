import { describe, expect, it } from "@reactgjs/gest";
import { SearchBar } from "../src/components/search-bar/search-bar";
import {
  ActionBar,
  Anchor,
  Big,
  Bold,
  Box,
  Button,
  ButtonBox,
  ButtonGroup,
  CheckButton,
  CustomWidget,
  Expander,
  FlowBox,
  FlowBoxEntry,
  Frame,
  Grid,
  GridItem,
  HeaderBar,
  Icon,
  Image,
  Italic,
  Label,
  LinkButton,
  Markup,
  MenuBar,
  MenuBarItem,
  MenuCheckButton,
  MenuEntry,
  MenuRadioButton,
  MenuSeparator,
  ModelButton,
  Monospace,
  NumberInput,
  Popover,
  PopoverMenu,
  PopoverMenuCheckButton,
  PopoverMenuEntry,
  PopoverMenuItem,
  PopoverMenuRadioButton,
  PopoverMenuSeparator,
  Pressable,
  RadioBox,
  RadioButton,
  Revealer,
  ScrollBox,
  SearchInput,
  Selector,
  Separator,
  SizeGroupBox,
  Slider,
  SliderPopupButton,
  Small,
  Span,
  Spinner,
  StackScreen,
  Strike,
  Sub,
  Sup,
  Switch,
  TextArea,
  TextInput,
  TextView,
  TextViewImage,
  TextViewLink,
  TextViewSpan,
  TextViewWidget,
  Toolbar,
  ToolbarButton,
  ToolbarItem,
  ToolbarRadioButton,
  ToolbarSeparator,
  ToolbarToggleButton,
  Underline,
  VolumeButton,
} from "../src/intrinsic-components";
import { isInstrinsic } from "../src/utils/intrinsic-marker";

export default describe("Intrinsic Components", () => {
  describe("should be detected as intrinsic", () => {
    it("ActionBar", () => {
      expect(isInstrinsic(ActionBar)).toBe(true);
    });

    it("Anchor", () => {
      expect(isInstrinsic(Anchor)).toBe(true);
    });

    it("Big", () => {
      expect(isInstrinsic(Big)).toBe(true);
    });

    it("Bold", () => {
      expect(isInstrinsic(Bold)).toBe(true);
    });

    it("Box", () => {
      expect(isInstrinsic(Box)).toBe(true);
    });

    it("Button", () => {
      expect(isInstrinsic(Button)).toBe(true);
    });

    it("ButtonBox", () => {
      expect(isInstrinsic(ButtonBox)).toBe(true);
    });

    it("ButtonGroup", () => {
      expect(isInstrinsic(ButtonGroup)).toBe(true);
    });

    it("CheckButton", () => {
      expect(isInstrinsic(CheckButton)).toBe(true);
    });

    it("CustomWidget", () => {
      expect(isInstrinsic(CustomWidget)).toBe(true);
    });

    it("Expander", () => {
      expect(isInstrinsic(Expander)).toBe(true);
    });

    it("FlowBox", () => {
      expect(isInstrinsic(FlowBox)).toBe(true);
    });

    it("FlowBoxEntry", () => {
      expect(isInstrinsic(FlowBoxEntry)).toBe(true);
    });

    it("Frame", () => {
      expect(isInstrinsic(Frame)).toBe(true);
    });

    it("Grid", () => {
      expect(isInstrinsic(Grid)).toBe(true);
    });

    it("GridItem", () => {
      expect(isInstrinsic(GridItem)).toBe(true);
    });

    it("HeaderBar", () => {
      expect(isInstrinsic(HeaderBar)).toBe(true);
    });

    it("Icon", () => {
      expect(isInstrinsic(Icon)).toBe(true);
    });

    it("Image", () => {
      expect(isInstrinsic(Image)).toBe(true);
    });

    it("Italic", () => {
      expect(isInstrinsic(Italic)).toBe(true);
    });

    it("Label", () => {
      expect(isInstrinsic(Label)).toBe(true);
    });

    it("LinkButton", () => {
      expect(isInstrinsic(LinkButton)).toBe(true);
    });

    it("Markup", () => {
      expect(isInstrinsic(Markup)).toBe(true);
    });

    it("MenuBar", () => {
      expect(isInstrinsic(MenuBar)).toBe(true);
    });

    it("MenuBarItem", () => {
      expect(isInstrinsic(MenuBarItem)).toBe(true);
    });

    it("MenuCheckButton", () => {
      expect(isInstrinsic(MenuCheckButton)).toBe(true);
    });

    it("MenuEntry", () => {
      expect(isInstrinsic(MenuEntry)).toBe(true);
    });

    it("MenuRadioButton", () => {
      expect(isInstrinsic(MenuRadioButton)).toBe(true);
    });

    it("MenuSeparator", () => {
      expect(isInstrinsic(MenuSeparator)).toBe(true);
    });

    it("ModelButton", () => {
      expect(isInstrinsic(ModelButton)).toBe(true);
    });

    it("Monospace", () => {
      expect(isInstrinsic(Monospace)).toBe(true);
    });

    it("NumberInput", () => {
      expect(isInstrinsic(NumberInput)).toBe(true);
    });

    it("Popover", () => {
      expect(isInstrinsic(Popover)).toBe(true);
    });

    it("PopoverMenu", () => {
      expect(isInstrinsic(PopoverMenu)).toBe(true);
    });

    it("PopoverMenuCheckButton", () => {
      expect(isInstrinsic(PopoverMenuCheckButton)).toBe(true);
    });

    it("PopoverMenuEntry", () => {
      expect(isInstrinsic(PopoverMenuEntry)).toBe(true);
    });

    it("PopoverMenuItem", () => {
      expect(isInstrinsic(PopoverMenuItem)).toBe(true);
    });

    it("PopoverMenuRadioButton", () => {
      expect(isInstrinsic(PopoverMenuRadioButton)).toBe(true);
    });

    it("PopoverMenuSeparator", () => {
      expect(isInstrinsic(PopoverMenuSeparator)).toBe(true);
    });

    it("Pressable", () => {
      expect(isInstrinsic(Pressable)).toBe(true);
    });

    it("RadioBox", () => {
      expect(isInstrinsic(RadioBox)).toBe(true);
    });

    it("RadioButton", () => {
      expect(isInstrinsic(RadioButton)).toBe(true);
    });

    it("Revealer", () => {
      expect(isInstrinsic(Revealer)).toBe(true);
    });

    it("ScrollBox", () => {
      expect(isInstrinsic(ScrollBox)).toBe(true);
    });

    it("SearchInput", () => {
      expect(isInstrinsic(SearchInput)).toBe(true);
    });

    it("Selector", () => {
      expect(isInstrinsic(Selector)).toBe(true);
    });

    it("Separator", () => {
      expect(isInstrinsic(Separator)).toBe(true);
    });

    it("SizeGroupBox", () => {
      expect(isInstrinsic(SizeGroupBox)).toBe(true);
    });

    it("Slider", () => {
      expect(isInstrinsic(Slider)).toBe(true);
    });

    it("SliderPopupButton", () => {
      expect(isInstrinsic(SliderPopupButton)).toBe(true);
    });

    it("Small", () => {
      expect(isInstrinsic(Small)).toBe(true);
    });

    it("Span", () => {
      expect(isInstrinsic(Span)).toBe(true);
    });

    it("Spinner", () => {
      expect(isInstrinsic(Spinner)).toBe(true);
    });

    it("StackScreen", () => {
      expect(isInstrinsic(StackScreen)).toBe(true);
    });

    it("Strike", () => {
      expect(isInstrinsic(Strike)).toBe(true);
    });

    it("Sub", () => {
      expect(isInstrinsic(Sub)).toBe(true);
    });

    it("Sup", () => {
      expect(isInstrinsic(Sup)).toBe(true);
    });

    it("Switch", () => {
      expect(isInstrinsic(Switch)).toBe(true);
    });

    it("TextArea", () => {
      expect(isInstrinsic(TextArea)).toBe(true);
    });

    it("TextInput", () => {
      expect(isInstrinsic(TextInput)).toBe(true);
    });

    it("TextView", () => {
      expect(isInstrinsic(TextView)).toBe(true);
    });

    it("TextViewImage", () => {
      expect(isInstrinsic(TextViewImage)).toBe(true);
    });

    it("TextViewLink", () => {
      expect(isInstrinsic(TextViewLink)).toBe(true);
    });

    it("TextViewSpan", () => {
      expect(isInstrinsic(TextViewSpan)).toBe(true);
    });

    it("TextViewWidget", () => {
      expect(isInstrinsic(TextViewWidget)).toBe(true);
    });

    it("Toolbar", () => {
      expect(isInstrinsic(Toolbar)).toBe(true);
    });

    it("ToolbarButton", () => {
      expect(isInstrinsic(ToolbarButton)).toBe(true);
    });

    it("ToolbarItem", () => {
      expect(isInstrinsic(ToolbarItem)).toBe(true);
    });

    it("ToolbarRadioButton", () => {
      expect(isInstrinsic(ToolbarRadioButton)).toBe(true);
    });

    it("ToolbarSeparator", () => {
      expect(isInstrinsic(ToolbarSeparator)).toBe(true);
    });

    it("ToolbarToggleButton", () => {
      expect(isInstrinsic(ToolbarToggleButton)).toBe(true);
    });

    it("Underline", () => {
      expect(isInstrinsic(Underline)).toBe(true);
    });

    it("VolumeButton", () => {
      expect(isInstrinsic(VolumeButton)).toBe(true);
    });

    it("SearchBar", () => {
      expect(isInstrinsic(SearchBar)).toBe(true);
    });
  });
});
