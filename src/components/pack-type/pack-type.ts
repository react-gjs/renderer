import Gtk from "gi://Gtk";
import React from "react";
import { useChildProperties } from "../../hooks/gtk3/use-child-properties/use-child-properties";

const CHILD_PROPS = {
  "pack-type": Gtk.PackType.END,
};

export const PackEnd = (props: { children: React.ReactElement }) => {
  const element = props.children.type;
  const elemProps = props.children.props;
  const elemKey = props.children.key;

  const Component = useChildProperties(element as any, CHILD_PROPS);

  return React.createElement(Component, { ...elemProps, key: elemKey });
};
