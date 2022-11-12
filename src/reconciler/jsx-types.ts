import type { BoxProps } from "../gjs-elements/box/box";
import type { ButtonProps } from "../gjs-elements/button/button";
import type { LabelProps } from "../gjs-elements/label/label";
import type { TextAreaProps } from "../gjs-elements/text-area/text-area";
import type { TextEntryProps } from "../gjs-elements/text-entry/text-entry";
import type { WindowProps } from "../gjs-elements/window/window";

export type ComponentAttributes<P> = {
  children?: React.ReactNode | React.ReactNode[];
} & P;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      WINDOW: ComponentAttributes<WindowProps>;
      BUTTON: ComponentAttributes<ButtonProps>;
      BOX: ComponentAttributes<BoxProps>;
      LABEL: ComponentAttributes<LabelProps>;
      TEXT_ENTRY: TextEntryProps;
      TEXT_AREA: TextAreaProps;
    }
  }
}
