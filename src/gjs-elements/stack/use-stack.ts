import Gtk from "gi://Gtk";
import React from "react";
import type { StackProps } from "./stack";
import type { StackSwitcherProps } from "./stack-switcher";

const StackComponent = "STACK";
const StackSwitcherComponent = "STACK_SWITCHER";

export const useStack = () => {
  const [stackWidget] = React.useState(() => new Gtk.Stack());

  const [Stack] = React.useState(() => (props: StackProps) => {
    return React.createElement(StackComponent, {
      ...props,
      _widget: stackWidget,
    });
  });

  const [Switcher] = React.useState(() => (props: StackSwitcherProps) => {
    return React.createElement(StackSwitcherComponent, {
      ...props,
      _widget: stackWidget,
    });
  });

  return { Stack, Switcher };
};
