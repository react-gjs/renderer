import Gtk from "gi://Gtk";
import React from "react";
import { useChildProperties } from "../../hooks/gtk3/use-child-properties/use-child-properties";

const CHILD_PROPS = {
  "pack-type": Gtk.PackType.END,
};

export const PackEnd = <E extends keyof JSX.IntrinsicElements>(
  props: {
    element: E;
  } & JSX.IntrinsicElements[E]
) => {
  const Component = useChildProperties(props.element, CHILD_PROPS);
  return React.createElement(Component, props);
};
