import GLib from "gi://GLib";

export const microtask = (task: () => void) => {
  imports.mainloop.idle_add(() => {
    task();
  }, GLib.PRIORITY_DEFAULT);
};
