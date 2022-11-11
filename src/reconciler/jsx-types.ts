import type { BoxProps } from "../gjs-elements/box/box";
import type { ButtonProps } from "../gjs-elements/button/button";
import type { LabelProps } from "../gjs-elements/label/label";
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
    }
  }
}
