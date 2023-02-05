import { DataType } from "dilswer";
import type { PropCaseCollector } from "../element-extenders/map-properties";

export type WidgetWithSizeRequest = {
  height_request: number | null;
  width_request: number | null;
};

export type SizeRequestProps = {
  /**
   * The width this element will request it's parent to allocate to
   * it.
   *
   * This property is somewhat similar to the CSS property
   * `min-width`, as elements can grow beyond their requested size.
   */
  widthRequest?: number;
  /**
   * The height this element will request it's parent to allocate to
   * it.
   *
   * This property is somewhat similar to the CSS property
   * `min-height`, as elements can grow beyond their requested size.
   */
  heightRequest?: number;
};

export const createSizeRequestPropMapper = (
  widget: WidgetWithSizeRequest,
  defaults?: {
    widthRequest?: number;
    heightRequest?: number;
  }
) => {
  return (mapper: PropCaseCollector<keyof SizeRequestProps, any>) =>
    mapper
      .heightRequest(DataType.Number, (v) => {
        widget.height_request = v ?? defaults?.heightRequest ?? null;
      })
      .widthRequest(DataType.Number, (v) => {
        widget.width_request = v ?? defaults?.widthRequest ?? null;
      });
};
