import { DataType } from "dilswer";

export type MarginProp =
  | number
  | [number]
  | [number, number]
  | [number, number, number]
  | [number, number, number, number];

export const MarginDataType = DataType.OneOf(
  DataType.Number,
  DataType.ArrayOf(DataType.Number)
);

export const applyMargin = (
  widget: {
    margin: number;
    margin_top: number;
    margin_end: number;
    margin_bottom: number;
    margin_start: number;
  },
  margin: number | number[]
) => {
  if (typeof margin === "number") {
    widget.margin_top = margin;
    widget.margin_end = margin;
    widget.margin_bottom = margin;
    widget.margin_start = margin;
  } else if (margin.length === 1) {
    widget.margin_top = margin[0];
    widget.margin_end = margin[0];
    widget.margin_bottom = margin[0];
    widget.margin_start = margin[0];
  } else if (margin.length === 2) {
    widget.margin_top = margin[0];
    widget.margin_end = margin[1];
    widget.margin_bottom = margin[0];
    widget.margin_start = margin[1];
  } else if (margin.length === 3) {
    widget.margin_top = margin[0];
    widget.margin_end = margin[1];
    widget.margin_bottom = margin[2];
    widget.margin_start = margin[1];
  } else if (margin.length === 4) {
    widget.margin_top = margin[0];
    widget.margin_end = margin[1];
    widget.margin_bottom = margin[2];
    widget.margin_start = margin[3];
  }
};
