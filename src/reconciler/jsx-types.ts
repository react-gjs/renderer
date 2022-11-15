import type { BoxProps } from "../gjs-elements/box/box";
import type { ButtonProps } from "../gjs-elements/button/button";
import type { FlowBoxEntryProps } from "../gjs-elements/flow-box-entry/flow-box-entry";
import type { FlowBoxProps } from "../gjs-elements/flow-box/flow-box";
import type { LabelProps } from "../gjs-elements/label/label";
import type { SwitchProps } from "../gjs-elements/switch/switch";
import type { TextAreaProps } from "../gjs-elements/text-area/text-area";
import type { TextEntryProps } from "../gjs-elements/text-entry/text-entry";
import type { WindowProps } from "../gjs-elements/window/window";

export type ComponentWithChildren<P> = {
  children?: React.ReactNode | React.ReactNode[];
} & P;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      BOX: ComponentWithChildren<BoxProps>;
      BUTTON: ComponentWithChildren<ButtonProps>;
      FLOW_BOX: ComponentWithChildren<FlowBoxProps>;
      FLOW_BOX_ENTRY: ComponentWithChildren<FlowBoxEntryProps>;
      LABEL: ComponentWithChildren<LabelProps>;
      LINK_BUTTON: ComponentWithChildren<ButtonProps>;
      SWITCH: SwitchProps;
      TEXT_AREA: TextAreaProps;
      TEXT_ENTRY: TextEntryProps;
      WINDOW: ComponentWithChildren<WindowProps>;
    }
  }
}
