import Gtk from "gi://Gtk?version=3.0";
import type { GjsElement } from "../gjs-element";
import type { DiffedProps } from "../utils/map-properties";

export class ApplicationElement implements GjsElement {
  readonly kind = "APPLICATION";

  private rootElement: GjsElement | string | null = null;

  constructor() {
    Gtk.init(null);
  }

  appendTo(parent: Gtk.Container): void {
    throw new Error("Application element can't be appended to a container.");
  }

  appendChild(child: string | GjsElement): void {
    this.rootElement = child;
  }

  updateProps(props: DiffedProps): void {
    throw new Error("Application element can't have it's props be updated.");
  }

  remove(parent: GjsElement): void {
    Gtk.main_quit();
  }

  render(): void {}

  start(): void {
    Gtk.main();
  }
}
