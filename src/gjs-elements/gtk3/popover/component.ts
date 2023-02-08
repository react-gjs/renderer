import Gtk from "gi://Gtk";
import React from "react";
import { EventLoop } from "../../utils/event-loop";
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
  const eventLoop = new EventLoop();

  const transitionTimeout = 125;

  const showPopover = () => {
    eventLoop.addEvent((done) => {
      popover.popup();
      setTimeout(done, transitionTimeout);
    });
  };

  const hidePopover = () => {
    eventLoop.addEvent((done) => {
      popover.popdown();
      setTimeout(done, transitionTimeout);
    });
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
