import { DataType } from "dilswer";
import type { PropCaseCollector } from "../element-extenders/map-properties";

export type ExpandProps = {
  /**
   * If true, the widget will expand vertically and horizontally to
   * fill all available space given to it. If multiple children of a
   * container are set to expand, the available space is divided
   * evenly between them.
   */
  expand?: boolean;
  /**
   * If true, the widget will expand horizontally to fill all
   * available space given to it. If multiple children of a container
   * are set to expand, the available space is divided evenly between
   * them.
   */
  expandHorizontal?: boolean;
  /**
   * If true, the widget will expand vertically to fill all available
   * space given to it. If multiple children of a container are set to
   * expand, the available space is divided evenly between them.
   */
  expandVertical?: boolean;
};

export const createExpandPropMapper = (
  Widget: {
    hexpand: boolean;
    vexpand: boolean;
    expand: boolean;
  },
  defaults?: {
    v?: boolean;
    h?: boolean;
  },
) => {
  return (mapper: PropCaseCollector<keyof ExpandProps, any>) =>
    mapper
      .expand(DataType.Boolean, (v = false, allProps) => {
        if (allProps.expandHorizontal === undefined) {
          Widget.hexpand = v;
        }

        if (allProps.expandVertical === undefined) {
          Widget.vexpand = v;
        }
      })
      .expandHorizontal(
        DataType.Boolean,
        (v = defaults?.h, allProps) => {
          if (v != null) {
            Widget.hexpand = v;
          } else if (allProps.expand !== undefined) {
            Widget.hexpand = allProps.expand;
          }
        },
      )
      .expandVertical(
        DataType.Boolean,
        (v = defaults?.v, allProps) => {
          if (v != null) {
            Widget.vexpand = v;
          } else if (allProps.expand !== undefined) {
            Widget.vexpand = allProps.expand;
          }
        },
      );
};
