import Gtk from "gi://Gtk";
import React from "react";
import type { GjsElementTypes } from "../../gjs-element-types";
import type { PopoverMenuProps as BaseProps } from "./popover-menu";

const PopoverElem: GjsElementTypes = "POPOVER_MENU";
const TargetElem: GjsElementTypes = "POPOVER_MENU_TARGET";
const ContentElem: GjsElementTypes = "POPOVER_MENU_CONTENT";

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
  const {
    renderAnchor: children,
    renderPopover: content,
    minWidth,
    ...rest
  } = props;

  const [popover] = React.useState(getPopoverMenuWidget);

  return React.createElement(
    PopoverElem,
    { ...rest, popoverWidget: popover.widget },
    React.createElement(
      ContentElem,
      { minWidth },
      props.renderPopover(popover.hidePopover)
    ),
    React.createElement(
      TargetElem,
      {},
      props.renderAnchor(popover.showPopover, popover.hidePopover)
    )
  );
};
