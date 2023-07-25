import Gtk from "gi://Gtk";
import React from "react";
import { EventLoop } from "../../utils/event-loop";
import type {
  PopoverMenuProps as BaseProps,
  PopoverMenuElement,
} from "./popover-menu";

const PopoverElem: Rg.GjsElementTypes = "POPOVER_MENU";
const TargetElem: Rg.GjsElementTypes = "POPOVER_MENU_TARGET";
const ContentElem: Rg.GjsElementTypes = "POPOVER_MENU_CONTENT";

export type PopoverMenuProps = BaseProps & {
  /** The minimum width of the Popover Menu. */
  minWidth?: number;
  /**
   * A function that should return the contents of the Popover Menu.
   * Popover Menu contents should be limited to Popover Menu Items.
   *
   * @param hidePopover - A function that can be called to hide the
   *   popover.
   */
  renderPopover: (hidePopover: () => void) => React.ReactElement;
  /**
   * A function that should return the element that the Popover Menu
   * will be attached to.
   *
   * @param showPopover - A function that can be called to show the
   *   popover.
   * @param hidePopover - A function that can be called to hide the
   *   popover.
   */
  renderAnchor: (
    showPopover: () => void,
    hidePopover: () => void,
  ) => React.ReactElement;
};

const getPopoverMenuWidget = () => {
  const popover = new Gtk.PopoverMenu();
  const eventLoop = new EventLoop();

  const transitionTimeout = 125;

  const showPopover = () => {
    eventLoop.addEvent((done) => {
      popover.popup();
      setTimeout(() => {
        popover.show_all();
        done();
      }, transitionTimeout);
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

export const PopoverMenu = React.forwardRef(
  (
    props: PopoverMenuProps,
    ref: React.ForwardedRef<PopoverMenuElement>,
  ) => {
    const {
      renderAnchor: children,
      renderPopover: content,
      minWidth,
      ...rest
    } = props;

    const [popover] = React.useState(getPopoverMenuWidget);

    return React.createElement(
      PopoverElem,
      { ...rest, ref, popoverWidget: popover.widget },
      React.createElement(
        ContentElem,
        { minWidth },
        content(popover.hidePopover),
      ),
      React.createElement(
        TargetElem,
        {},
        children(popover.showPopover, popover.hidePopover),
      ),
    );
  },
);
