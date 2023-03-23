import { MenuCheckButtonElement } from "./menu-check-button";
import { MenuEntryElement } from "./menu-entry";
import { MenuRadioButtonElement } from "./menu-radio-button";
import { MenuSeparatorElement } from "./menu-separator";

export const MENU_ELEMENTS = [
  MenuEntryElement,
  MenuCheckButtonElement,
  MenuRadioButtonElement,
  MenuSeparatorElement,
];

export type MenuItemElementType = InstanceType<(typeof MENU_ELEMENTS)[number]>;
