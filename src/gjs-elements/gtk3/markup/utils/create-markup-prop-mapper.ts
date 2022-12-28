import { DataType as Type } from "dilswer";
import type { PropCaseCollector } from "../../../utils/element-extenders/map-properties";
import type { MarkupElementProps } from "../markup-elem";
import type { MAttributes } from "./attributes";

export const createMarkupPropMapper = (attributes: MAttributes) => {
  return (
    mapper: PropCaseCollector<keyof MarkupElementProps, MarkupElementProps>
  ) =>
    mapper
      .allowBreaks(Type.Boolean, (v) => {
        if (v) attributes.set("allow_breaks", v.toString());
        else attributes.delete("allow_breaks");
      })
      .alpha(Type.OneOf(Type.Int, Type.String), (v) => {
        if (v) attributes.set("alpha", v.toString());
        else attributes.delete("alpha");
      })
      .backgroundAlpha(Type.OneOf(Type.Int, Type.String), (v) => {
        if (v) attributes.set("bgalpha", v.toString());
        else attributes.delete("bgalpha");
      })
      .backgroundColor(Type.String, (v) => {
        if (v) attributes.set("background", v);
        else attributes.delete("background");
      })
      .baselineShift(Type.Int, (v) => {
        if (v) attributes.set("baseline_shift", `${v}pt`);
        else attributes.delete("baseline_shift");
      })
      .color(Type.String, (v) => {
        if (v) attributes.set("foreground", v);
        else attributes.delete("foreground");
      })
      .fallback(Type.Boolean, (v) => {
        if (v) attributes.set("fallback", v.toString());
        else attributes.delete("fallback");
      })
      .font(Type.String, (v) => {
        if (v) attributes.set("font_desc", v);
        else attributes.delete("font_desc");
      })
      .fontFamily(Type.String, (v) => {
        if (v) attributes.set("face", v);
        else attributes.delete("face");
      })
      .fontFeatures(Type.String, (v) => {
        if (v) attributes.set("font_features", v);
        else attributes.delete("font_features");
      })
      .fontScale(Type.String, (v) => {
        if (v) attributes.set("font_scale", v);
        else attributes.delete("font_scale");
      })
      .fontSize(Type.OneOf(Type.Number, Type.String), (v) => {
        if (v) attributes.set("size", typeof v === "number" ? `${v}pt` : v);
        else attributes.delete("size");
      })
      .fontStretch(Type.String, (v) => {
        if (v) attributes.set("stretch", v);
        else attributes.delete("stretch");
      })
      .fontStyle(Type.String, (v) => {
        if (v) attributes.set("style", v);
        else attributes.delete("style");
      })
      .fontVariant(Type.String, (v) => {
        if (v) attributes.set("variant", v);
        else attributes.delete("variant");
      })
      .fontWeight(Type.OneOf(Type.Int, Type.String), (v) => {
        if (v) attributes.set("weight", v.toString());
        else attributes.delete("weight");
      })
      .gravity(Type.String, (v) => {
        if (v) attributes.set("gravity", v);
        else attributes.delete("gravity");
      })
      .gravityHint(Type.String, (v) => {
        if (v) attributes.set("gravity_hint", v);
        else attributes.delete("gravity_hint");
      })
      .insertHyphens(Type.Boolean, (v) => {
        if (v) attributes.set("insert_hyphens", v.toString());
        else attributes.delete("insert_hyphens");
      })
      .language(Type.String, (v) => {
        if (v) attributes.set("lang", v);
        else attributes.delete("lang");
      })
      .letterSpacing(Type.Number, (v) => {
        if (v) attributes.set("letter_spacing", v.toString());
        else attributes.delete("letter_spacing");
      })
      .lineHeight(Type.Number, (v) => {
        if (v) attributes.set("line_height", v.toString());
        else attributes.delete("line_height");
      })
      .overline(Type.String, (v) => {
        if (v) attributes.set("overline", v);
        else attributes.delete("overline");
      })
      .overlineColor(Type.String, (v) => {
        if (v) attributes.set("overline_color", v);
        else attributes.delete("overline_color");
      })
      .rise(Type.Number, (v) => {
        if (v) attributes.set("rise", `${v}pt`);
        else attributes.delete("rise");
      })
      .segment(Type.String, (v) => {
        if (v) attributes.set("segment_background", v);
        else attributes.delete("segment_background");
      })
      .show(Type.String, (v) => {
        if (v) attributes.set("show", v);
        else attributes.delete("show");
      })
      .strikethrough(Type.Boolean, (v) => {
        if (v) attributes.set("strikethrough", v.toString());
        else attributes.delete("strikethrough");
      })
      .strikethroughColor(Type.String, (v) => {
        if (v) attributes.set("strikethrough_color", v);
        else attributes.delete("strikethrough_color");
      })
      .transform(Type.String, (v) => {
        if (v) attributes.set("text_transform", v);
        else attributes.delete("text_transform");
      })
      .underline(Type.String, (v) => {
        if (v) attributes.set("underline", v);
        else attributes.delete("underline");
      })
      .underlineColor(Type.String, (v) => {
        if (v) attributes.set("underline_color", v);
        else attributes.delete("underline_color");
      });
};
