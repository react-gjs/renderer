import type { PopoverMenuRadioButtonElement } from "../content-elements/popover-menu-radio-button";

class RadioGroup {
  private buttons = new Map<symbol, PopoverMenuRadioButtonElement>();
  private selected?: symbol;

  constructor(public readonly name: string) {}

  isSelected(button: PopoverMenuRadioButtonElement) {
    return this.selected === button.id;
  }

  add(button: PopoverMenuRadioButtonElement, defaultOption: boolean) {
    this.buttons.set(button.id, button);

    if (defaultOption && !this.selected) {
      this.selected = button.id;
    }
  }

  remove(button: PopoverMenuRadioButtonElement) {
    this.buttons.delete(button.id);
  }

  select(button: PopoverMenuRadioButtonElement) {
    if (button.id === this.selected) return;

    this.selected = button.id;

    let newSelectedBtn: PopoverMenuRadioButtonElement | undefined;
    for (const [id, btn] of this.buttons) {
      if (id !== this.selected) {
        btn.setActiveState(false);
      } else {
        newSelectedBtn = btn;
      }
    }
    newSelectedBtn?.setActiveState(true);
  }
}

export class PopoverMenuRadioController {
  private groups = new Map<string, RadioGroup>();

  addToGroup(
    groupName: string,
    button: PopoverMenuRadioButtonElement,
    defaultOption = false
  ) {
    let group = this.groups.get(groupName);

    if (!group) {
      group = new RadioGroup(groupName);
      this.groups.set(groupName, group);
    }

    group.add(button, defaultOption);

    return group;
  }

  removeFromGroup(groupName: string, button: PopoverMenuRadioButtonElement) {
    const group = this.groups.get(groupName);
    if (!group) return false;

    group.remove(button);
    return true;
  }
}

export type { RadioGroup };
