import type Gtk from "gi://Gtk?version=3.0";
import type { BoxProps } from "../gjs-elements/box/box";
import type { ButtonProps } from "../gjs-elements/button/button";
import type { CheckButtonProps } from "../gjs-elements/check-button/check-button";
import type { FlowBoxProps } from "../gjs-elements/flow-box/flow-box";
import type { FlowBoxEntryProps } from "../gjs-elements/flow-box/flow-box-entry";
import type { GjsElement } from "../gjs-elements/gjs-element";
import type { GjsElementTypes } from "../gjs-elements/gjs-element-types";
import type { LabelProps } from "../gjs-elements/label/label";
import type { SwitchProps } from "../gjs-elements/switch/switch";
import type { TextAreaProps } from "../gjs-elements/text-area/text-area";
import type { TextEntryProps } from "../gjs-elements/text-entry/text-entry";
import type { WindowProps } from "../gjs-elements/window/window";

export type ComponentWithChildren<P> = {
  children?: React.ReactNode | React.ReactNode[];
} & P;

type ElementForWidget<W> = GjsElement<GjsElementTypes> & {
  widget: W;
};

export type IntrinsicComponent<P, W> = {
  ref?:
    | {
        current?: ElementForWidget<W> | null;
      }
    | ((ref: ElementForWidget<W>) => void);
} & P;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      BOX: IntrinsicComponent<ComponentWithChildren<BoxProps>, Gtk.Box>;
      BUTTON: IntrinsicComponent<
        ComponentWithChildren<ButtonProps>,
        Gtk.Button
      >;
      CHECK_BUTTON: IntrinsicComponent<
        ComponentWithChildren<CheckButtonProps>,
        Gtk.CheckButton
      >;
      FLOW_BOX: IntrinsicComponent<
        ComponentWithChildren<FlowBoxProps>,
        Gtk.FlowBox
      >;
      FLOW_BOX_ENTRY: IntrinsicComponent<
        ComponentWithChildren<FlowBoxEntryProps>,
        Gtk.FlowBoxChild
      >;
      LABEL: IntrinsicComponent<ComponentWithChildren<LabelProps>, Gtk.Label>;
      LINK_BUTTON: IntrinsicComponent<
        ComponentWithChildren<ButtonProps>,
        Gtk.LinkButton
      >;
      SWITCH: IntrinsicComponent<SwitchProps, Gtk.Switch>;
      TEXT_AREA: IntrinsicComponent<TextAreaProps, Gtk.TextView>;
      TEXT_ENTRY: IntrinsicComponent<TextEntryProps, Gtk.Entry>;
      WINDOW: IntrinsicComponent<
        ComponentWithChildren<WindowProps>,
        Gtk.Window
      >;
    }
  }
}
