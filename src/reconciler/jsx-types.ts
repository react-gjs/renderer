import type { BoxElement, BoxProps } from "../gjs-elements/box/box";
import type { ButtonElement, ButtonProps } from "../gjs-elements/button/button";
import type {
  CheckButtonElement,
  CheckButtonProps,
} from "../gjs-elements/check-button/check-button";
import type {
  FlowBoxElement,
  FlowBoxProps,
} from "../gjs-elements/flow-box/flow-box";
import type {
  FlowBoxEntryElement,
  FlowBoxEntryProps,
} from "../gjs-elements/flow-box/flow-box-entry";
import type { GridElement, GridProps } from "../gjs-elements/grid/grid";
import type {
  GridItemElement,
  GridItemProps,
} from "../gjs-elements/grid/grid-item";
import type { LabelElement, LabelProps } from "../gjs-elements/label/label";
import type { LinkButtonElement } from "../gjs-elements/link-button/link-button";
import type { SwitchElement, SwitchProps } from "../gjs-elements/switch/switch";
import type {
  TextAreaElement,
  TextAreaProps,
} from "../gjs-elements/text-area/text-area";
import type {
  TextEntryElement,
  TextEntryProps,
} from "../gjs-elements/text-entry/text-entry";
import type { WindowElement, WindowProps } from "../gjs-elements/window/window";

export type ComponentWithChildren<P> = {
  children?: React.ReactNode | React.ReactNode[];
} & P;

export type IntrinsicComponent<P, W> = {
  ref?:
    | {
        current?: W | null;
      }
    | ((ref: W) => void);
} & P;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      BOX: IntrinsicComponent<ComponentWithChildren<BoxProps>, BoxElement>;
      BUTTON: IntrinsicComponent<
        ComponentWithChildren<ButtonProps>,
        ButtonElement
      >;
      CHECK_BUTTON: IntrinsicComponent<
        ComponentWithChildren<CheckButtonProps>,
        CheckButtonElement
      >;
      FLOW_BOX: IntrinsicComponent<
        ComponentWithChildren<FlowBoxProps>,
        FlowBoxElement
      >;
      FLOW_BOX_ENTRY: IntrinsicComponent<
        ComponentWithChildren<FlowBoxEntryProps>,
        FlowBoxEntryElement
      >;
      GRID: IntrinsicComponent<ComponentWithChildren<GridProps>, GridElement>;
      GRID_ITEM: IntrinsicComponent<
        ComponentWithChildren<GridItemProps>,
        GridItemElement
      >;
      LABEL: IntrinsicComponent<
        ComponentWithChildren<LabelProps>,
        LabelElement
      >;
      LINK_BUTTON: IntrinsicComponent<
        ComponentWithChildren<ButtonProps>,
        LinkButtonElement
      >;
      SWITCH: IntrinsicComponent<SwitchProps, SwitchElement>;
      TEXT_AREA: IntrinsicComponent<TextAreaProps, TextAreaElement>;
      TEXT_ENTRY: IntrinsicComponent<TextEntryProps, TextEntryElement>;
      WINDOW: IntrinsicComponent<
        ComponentWithChildren<WindowProps>,
        WindowElement
      >;
    }
  }
}
