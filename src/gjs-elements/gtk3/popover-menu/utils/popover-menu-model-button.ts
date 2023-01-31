import Gtk from "gi://Gtk";

export const POPOVER_MENU_MARGIN = 6;

const V_MARGIN = 5;
const H_MARGIN = 5;

export const popoverMenuModelButton = () => {
  const btn = new Gtk.ModelButton();

  const label = btn.get_child()!;

  label.margin_top = V_MARGIN;
  label.margin_bottom = V_MARGIN;
  label.margin_start = H_MARGIN;
  label.margin_end = H_MARGIN;

  return btn;
};
