import type Gtk from "gi://Gtk";
import { getGLibListIterable } from "../get-g-list-iterator";

export const detachAllChildren = (container: Gtk.Container) => {
  const allChildren = container.get_children();

  for (const child of getGLibListIterable<Gtk.Widget>(allChildren)) {
    container.remove(child);
  }
};
