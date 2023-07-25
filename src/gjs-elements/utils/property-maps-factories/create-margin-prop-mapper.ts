import { DataType } from "dilswer";
import type {
  ElementMargin,
  WidgetWithMargin,
} from "../apply-margin";
import { applyMargin } from "../apply-margin";
import type { PropCaseCollector } from "../element-extenders/map-properties";

export type MarginProps = {
  margin?: ElementMargin;
};

export const MarginDataType = DataType.OneOf(
  DataType.Number,
  DataType.ArrayOf(DataType.Number),
);

export const createMarginPropMapper = (widget: WidgetWithMargin) => {
  return (mapper: PropCaseCollector<keyof MarginProps, any>) =>
    mapper.margin(MarginDataType, (v = 0) => {
      applyMargin(widget, v);
    });
};
