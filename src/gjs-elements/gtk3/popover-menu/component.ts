import Gtk from "gi://Gtk";
import React from "react";
import type { GjsElementTypes } from "../../gjs-element-types";
import type { PopoverMenuProps as BaseProps } from "./popover-menu";

const PopoverElem: GjsElementTypes = "POPOVER_MENU";
const TargetElem: GjsElementTypes = "POPOVER_MENU_TARGET";
const ContentElem: GjsElementTypes = "POPOVER_MENU_CONTENT";

export type PopoverMenuProps = BaseProps & {
  minWidth?: number;
  content: (hidePopover: () => void) => React.ReactElement;
  children: (
    showPopover: () => void,
    hidePopover: () => void
  ) => React.ReactElement;
};

const getPopoverMenuWidget = () => {
  const popover = new Gtk.PopoverMenu();

  const showPopover = () => {
    popover.show_all();
    popover.popup();
  };

  const hidePopover = () => {
    popover.popdown();
  };

  return {
    widget: popover,
    showPopover,
    hidePopover,
  };
};

export const PopoverMenu = (props: PopoverMenuProps) => {
  const { children, content, minWidth, ...rest } = props;

  const [popover] = React.useState(getPopoverMenuWidget);

  return React.createElement(
    PopoverElem,
    { ...rest, popoverWidget: popover.widget },
    React.createElement(
      ContentElem,
      { minWidth },
      props.content(popover.hidePopover)
    ),
    React.createElement(
      TargetElem,
      {},
      props.children(popover.showPopover, popover.hidePopover)
    )
  );
};
