import Gdk from "gi://Gdk";
import Gtk from "gi://Gtk";
import Pango from "gi://Pango";

export { MouseButton } from "./gjs-elements/utils/gdk-events/mouse-button-press-event";
export type { MouseButtonPressEvent } from "./gjs-elements/utils/gdk-events/mouse-button-press-event";

export type Align = Gtk.Align;
export const Align = Gtk.Align;

export type BaselinePosition = Gtk.BaselinePosition;
export const BaselinePosition = Gtk.BaselinePosition;

export type Justification = Gtk.Justification;
export const Justification = Gtk.Justification;

export type Orientation = Gtk.Orientation;
export const Orientation = Gtk.Orientation;

export type PositionType = Gtk.PositionType;
export const PositionType = Gtk.PositionType;

export type EllipsizeMode = Pango.EllipsizeMode;
export const EllipsizeMode = Pango.EllipsizeMode;

export type WrapMode = Pango.WrapMode;
export const WrapMode = Pango.WrapMode;

export type SelectionMode = Gtk.SelectionMode;
export const SelectionMode = Gtk.SelectionMode;

export type ImageType = Gtk.ImageType;
export const ImageType = Gtk.ImageType;

export type CornerType = Gtk.CornerType;
export const CornerType = Gtk.CornerType;

export type PolicyType = Gtk.PolicyType;
export const PolicyType = Gtk.PolicyType;

export type ShadowType = Gtk.ShadowType;
export const ShadowType = Gtk.ShadowType;

export type PopoverConstraint = Gtk.PopoverConstraint;
export const PopoverConstraint = Gtk.PopoverConstraint;

export type StackTransitionType = Gtk.StackTransitionType;
export const StackTransitionType = Gtk.StackTransitionType;

export type WindowType = Gtk.WindowType;
export const WindowType = Gtk.WindowType;

export type WindowTypeHint = Gdk.WindowTypeHint;
export const WindowTypeHint = Gdk.WindowTypeHint;

export type SpinButtonUpdatePolicy = Gtk.SpinButtonUpdatePolicy;
export const SpinButtonUpdatePolicy = Gtk.SpinButtonUpdatePolicy;

export type SpinType = Gtk.SpinType;
export const SpinType = Gtk.SpinType;

export type ButtonBoxStyle = Gtk.ButtonBoxStyle;
export const ButtonBoxStyle = Gtk.ButtonBoxStyle;

export type SizeGroupMode = Gtk.SizeGroupMode;
export const SizeGroupMode = Gtk.SizeGroupMode;

export type ToolbarStyle = Gtk.ToolbarStyle;
export const ToolbarStyle = Gtk.ToolbarStyle;

export type IconSize = Gtk.IconSize;
export const IconSize = Gtk.IconSize;

export type Sensitivity = Gtk.SensitivityType;
export const Sensitivity = Gtk.SensitivityType;

export enum ButtonType {
  FLAT,
  NORMAL,
}

export enum ControlButton {
  CLOSE = "close",
  MINIMIZE = "minimize",
  MAXIMIZE = "maximize",
  ICON = "icon",
}
