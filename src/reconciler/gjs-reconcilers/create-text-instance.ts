import Gtk from "gi://Gtk?version=3.0";

export const createTextInstance = (text: string, parent: any) => {
  if (!(parent instanceof Gtk.Label)) {
    throw new Error("Text can only be appended to labels.");
  }
  return text;
};
