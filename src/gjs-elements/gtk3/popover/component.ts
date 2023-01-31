import Gtk from "gi://Gtk";
import React from "react";
import type { PopoverProps as BaseProps } from "./popover";

const PopoverElem = "POPOVER";
const PopoverTargetElem = "POPOVER_TARGET";
const PopoverContentElem = "POPOVER_CONTENT";

export type PopoverProps = BaseProps & {
  /**
   * A function that should return the contents of the Popover.
   *
   * @param hidePopover - A function that can be called to hide the
   *   popover.
   */
  renderPopover: (hidePopover: () => void) => React.ReactElement;
  /**
   * A function that should return the element that the Popover will
   * be attached to.
   *
   * @param showPopover - A function that can be called to show the
   *   popover.
   * @param hidePopover - A function that can be called to hide the
   *   popover.
   */
  renderAnchor: (
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
  const { renderAnchor: children, renderPopover: content, ...rest } = props;

  const [popover] = React.useState(getPopoverWidget);

  return React.createElement(
    PopoverElem,
    { ...rest, popoverWidget: popover.widget },
    React.createElement(
      PopoverContentElem,
      {},
      props.renderPopover(popover.hidePopover)
    ),
    React.createElement(
      PopoverTargetElem,
      {},
      props.renderAnchor(popover.showPopover, popover.hidePopover)
    )
  );
};
