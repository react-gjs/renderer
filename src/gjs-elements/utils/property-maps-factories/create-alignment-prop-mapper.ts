import { DataType } from "dilswer";
import { Align } from "../../../g-enums";
import type { PropMapper } from "../map-properties";

export type AlignmentProps = {
  verticalAlign?: Align;
  horizontalAlign?: Align;
};

export const createAlignmentPropMapper = (widget: {
  halign: Align;
  valign: Align;
}) => {
  return (mapper: PropMapper<keyof AlignmentProps>) =>
    mapper
      .horizontalAlign(DataType.Enum(Align), (v = Align.START) => {
        widget.halign = v;
      })
      .verticalAlign(DataType.Enum(Align), (v = Align.START) => {
        widget.valign = v;
      });
};
