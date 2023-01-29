import type { PopoverMenuRadioButtonElement } from "../content-elements/popover-menu-radio-button";

class RadioGroup {
  private buttons = new Map<symbol, PopoverMenuRadioButtonElement>();
  private selected?: symbol;

  constructor(public readonly name: string) {}

  isSelected(button: PopoverMenuRadioButtonElement) {
    return this.selected === button.id;
  }

  add(button: PopoverMenuRadioButtonElement) {
    this.buttons.set(button.id, button);
  }

  remove(button: PopoverMenuRadioButtonElement) {
    this.buttons.delete(button.id);
  }

  select(button: PopoverMenuRadioButtonElement) {
    if (button.id === this.selected) return;

    this.selected = button.id;

    for (const [id, btn] of this.buttons) {
      btn.setActiveState(id === this.selected);
    }
  }
}

export class PopoverMenuRadioController {
  private groups = new Map<string, RadioGroup>();

  addToGroup(groupName: string, button: PopoverMenuRadioButtonElement) {
    let group = this.groups.get(groupName);

    if (!group) {
      group = new RadioGroup(groupName);
      this.groups.set(groupName, group);
    }

    group.add(button);

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
