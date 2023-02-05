import type Gtk from "gi://Gtk";
import React from "react";
import type { GjsElement } from "../../../gjs-elements/gjs-element";
import { compareRecordsShallow } from "../../../gjs-elements/utils/diff-props";

export const useChildProperties = <E extends keyof JSX.IntrinsicElements>(
  element: E,
  childProperties: Record<string, string | number>
) => {
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

  const [refCallback] = React.useState(() => (element?: GjsElement) => {
    if (element) {
      if (ref.current !== element) {
        ref.current = element;
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
