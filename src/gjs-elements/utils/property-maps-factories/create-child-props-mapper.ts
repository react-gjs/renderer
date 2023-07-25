import { Type, compileFastValidator } from "dilswer";
import type Gtk from "gi://Gtk";
import type { PackType } from "../../../enums/gtk3-index";
import type { GjsElement } from "../../gjs-element";
import type { CaseCollectorCallback } from "../element-extenders/map-properties";

type ChildPropertyValue = string | number | boolean | undefined;

export type ChildPropertiesProps = {
  /**
   * Defines how the element is packed within it's parent. When set to
   * `END` elements are packed at the end of the parent in reversed
   * order (i.e. last child will be first one visible when looking
   * from left to right, or top to bottom).
   */
  "cpt:pack-type"?: PackType;
  /**
   * `cpt` stands for `child property`.
   *
   * `cpt:*` prefix is used to define Gtk's `child properties`, those
   * properties do not belong to the element itself, or it's parent,
   * but rather to the relation between them.
   *
   * A typical example of a child property is `pack-type` which is
   * used to define the packing location of a child inside it's
   * container.
   *
   * `cpt` props are not individually handled by the Element, rather
   * whatever string of characters you put after `cpt:` will be used
   * to define a child property, this means that it's possible to
   * define a child property with an incorrect name and not get any
   * errors.
   *
   * @example
   *   // Assuming you have the following element:
   *   <Box cpt:pack-type={Gtk.PackType.START} />
   *
   *   // This is what will happen behind the scenes:
   *   parentWidgetOfTheBox.child_set_property(
   *   boxWidget,
   *   "pack-type",
   *   Gtk.PackType.START
   *   );
   */
  [k: `cpt:${string}`]: ChildPropertyValue;
};

const isValidChildProperty = compileFastValidator(
  Type.OneOf(Type.String, Type.Number, Type.Boolean, Type.Undefined),
);

const CHILD_PROP_PREFIX = "cpt:";

export const createChildPropsMapper = (
  getWidget: () => Gtk.Widget,
  getParent: () => undefined | null | GjsElement,
): CaseCollectorCallback<any> => {
  return (_, { addCustomCase, lifecycle, props }) => {
    const afterMount = () => {
      const parent = getParent()!.getWidget();
      const widget = getWidget();

      if ("child_set_property" in parent) {
        const childProps = Object.getOwnPropertyNames(props).filter(
          (n) => n.startsWith(CHILD_PROP_PREFIX),
        );

        for (let i = 0; i < childProps.length; i++) {
          const value = props[childProps[i]];
          const cptName = childProps[i].slice(
            CHILD_PROP_PREFIX.length,
          );

          // @ts-expect-error
          parent.child_set_property(widget, cptName, value);
        }
      }
    };

    lifecycle.onMounted(afterMount);

    addCustomCase(
      (name) => name.startsWith(CHILD_PROP_PREFIX),
      (v, props, { propName }) => {
        if (!isValidChildProperty(v)) {
          console.error(
            new TypeError(
              `Invalid prop type. (${propName}) Received value: ${v}`,
            ),
          );
          return;
        }

        const parent = getParent()?.getWidget();

        if (parent != null) {
          if ("child_set_property" in parent) {
            // @ts-expect-error
            parent.child_set_property(
              getWidget(),
              propName.slice(CHILD_PROP_PREFIX.length),
              v,
            );
          }
        }
      },
    );
  };
};
