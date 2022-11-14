import type { BoxProps } from "../gjs-elements/box/box";
import type { ButtonProps } from "../gjs-elements/button/button";
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
      WINDOW: ComponentWithChildren<WindowProps>;
      BUTTON: ComponentWithChildren<ButtonProps>;
      BOX: ComponentWithChildren<BoxProps>;
      LABEL: ComponentWithChildren<LabelProps>;
      TEXT_ENTRY: TextEntryProps;
      TEXT_AREA: TextAreaProps;
      SWITCH: SwitchProps;
    }
  }
}
