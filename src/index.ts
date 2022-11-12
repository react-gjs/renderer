import Gtk from "gi://Gtk?version=3.0";
import Pango from "gi://Pango";
import type D from "./gjs-declarations/index";
export * from "./intrinsic-components";
export * from "./process-exit";
export * from "./reconciler/index";
export * from "./reconciler/jsx-types";
export type { D };

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
