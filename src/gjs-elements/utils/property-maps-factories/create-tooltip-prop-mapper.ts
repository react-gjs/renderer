import { DataType } from "dilswer";
import type { PropCaseCollector } from "../element-extenders/map-properties";

export type WidgetWithTooltip = {
  tooltip_text: string | null;
};

export type TooltipProps = {
  /**
   * The text to display in the tooltip.
   */
  tooltip?: string;
};

export const createTooltipPropMapper = (
  widget: WidgetWithTooltip,
) => {
  return (mapper: PropCaseCollector<keyof TooltipProps, any>) =>
    mapper.tooltip(DataType.String, (v) => {
      widget.tooltip_text = v ?? null;
    });
};
