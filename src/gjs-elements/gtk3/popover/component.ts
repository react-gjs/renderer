import Gtk from "gi://Gtk";
import React from "react";
import type { PopoverProps as BaseProps } from "./popover";

const PopoverElem = "POPOVER";
const PopoverTargetElem = "POPOVER_TARGET";
const PopoverContentElem = "POPOVER_CONTENT";

export type PopoverProps = BaseProps & {
  content: (hidePopover: () => void) => React.ReactElement;
  children: (
    showPopover: () => void,
    hidePopover: () => void
  ) => React.ReactElement;
};

const getPopoverWidget = () => {
  const popover = new Gtk.Popover();

  const showPopover = () => {
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

export const Popover = (props: PopoverProps) => {
  const { children, content, ...rest } = props;

  const [popover] = React.useState(getPopoverWidget);

  return React.createElement(
    PopoverElem,
    { ...rest, popoverWidget: popover.widget },
    React.createElement(
      PopoverContentElem,
      {},
      props.content(popover.hidePopover)
    ),
    React.createElement(
      PopoverTargetElem,
      {},
      props.children(popover.showPopover, popover.hidePopover)
    )
  );
};
