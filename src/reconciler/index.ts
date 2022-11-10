import Gtk from "gi://Gtk?version=3.0";
import { GjsRenderer } from "./gjs-renderer";

Gtk.init();

export const render = (app: JSX.Element) => {
  const window = new Gtk.Window();
  window.connect("destroy", () => Gtk.main_quit());

  const container = GjsRenderer.createContainer(
    window,
    1,
    null,
    false,
    null,
    "",
    () => console.error,
    null
  );

  GjsRenderer.updateContainer(app, container, null);

  window.show_all();
  Gtk.main();
};
