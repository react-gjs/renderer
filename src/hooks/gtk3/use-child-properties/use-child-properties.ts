import type Gtk from "gi://Gtk";
import React from "react";
import type { GjsElement } from "../../../gjs-elements/gjs-element";
import { compareRecordsShallow } from "../../../gjs-elements/utils/diff-props";
import { isInstrinsic } from "../../../intrinsic-components";

export const useChildProperties = <
  E extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>
>(
  element: E,
  childProperties: Record<string, string | number>
) => {
  if (!(typeof element === "string" || isInstrinsic(element))) {
    throw new Error(
      `Child Properties can only be used with intrinsic elements. ${element} is not an intrinsic element.`
    );
  }

  const childProps = React.useRef({});
  const ref = React.useRef<GjsElement>();

  const [applyProperties] = React.useState(() => () => {
    if (!ref.current) return;
    // @ts-expect-error TODO: fix later
    const parent = (ref.current.parent as GjsElement).widget as
      | Gtk.Container
      | Gtk.Widget;

    if ("child_set_property" in parent) {
      for (const [key, value] of Object.entries(childProps.current)) {
        parent.child_set_property(ref.current.getWidget(), key, value);
      }
    }
  });

  const [refCallback] = React.useState(() => (elem?: GjsElement) => {
    if (elem) {
      if (ref.current !== elem) {
        ref.current = elem;
        applyProperties();
      }
    } else {
      ref.current = undefined;
    }
  });

  const [Component] = React.useState(() => (props: any) => {
    return React.createElement(element, { ...props, ref: refCallback });
  });

  React.useEffect(() => {
    const changed = compareRecordsShallow(childProps.current, childProperties);

    if (changed) {
      childProps.current = childProperties;
      applyProperties();
    }
  }, [childProperties]);

  return Component;
};
