import React from "react";
import { PackType } from "../../enums/gtk3-index";

export const PackEnd = (props: { children: React.ReactElement }) => {
  return React.cloneElement(props.children, {
    "cpt:pack-type": PackType.END,
  });
};
