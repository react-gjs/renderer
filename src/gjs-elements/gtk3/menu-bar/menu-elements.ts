import { MenuCheckButtonElement } from "./menu-check-button";
import { MenuEntryElement } from "./menu-entry";
import { MenuSeparatorElement } from "./menu-separator";

export const MENU_ELEMENTS = [
  MenuEntryElement,
  MenuCheckButtonElement,
  MenuSeparatorElement,
];

export type MenuItemElementType = InstanceType<typeof MENU_ELEMENTS[number]>;
