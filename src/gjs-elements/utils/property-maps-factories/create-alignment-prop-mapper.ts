import { DataType } from "dilswer";
import Gtk from "gi://Gtk";
import type { Align } from "../../../enums/gtk3-index";
import type { PropCaseCollector } from "../element-extenders/map-properties";

export type AlignmentProps = {
  /**
   * The vertical alignment of the widget within its allocated space.
   * This property does not affect how much space the widget gets.
   */
  verticalAlign?: Align;
  /**
   * The horizontal alignment of the widget within its allocated
   * space. This property does not affect how much space the widget
   * gets.
   */
  horizontalAlign?: Align;
};

export const createAlignmentPropMapper = (
  widget: {
    halign: Gtk.Align;
    valign: Gtk.Align;
  },
  defaults?: { h?: Gtk.Align; v?: Gtk.Align },
) => {
  const defaultV = defaults?.v ?? Gtk.Align.START;
  const defaultH = defaults?.h ?? Gtk.Align.CENTER;

  return (mapper: PropCaseCollector<keyof AlignmentProps, any>) =>
    mapper
      .horizontalAlign(DataType.Enum(Gtk.Align), (v = defaultH) => {
        widget.halign = v;
      })
      .verticalAlign(DataType.Enum(Gtk.Align), (v = defaultV) => {
        widget.valign = v;
      });
};
