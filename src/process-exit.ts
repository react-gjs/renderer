// import Gtk from "gi://Gtk";

export const exit = () => {
  // Gtk.main_quit();
  // @ts-expect-error
  imports.mainloop.quit();
};
