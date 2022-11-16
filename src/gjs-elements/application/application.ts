import Gtk from "gi://Gtk";
import type { GjsElement } from "../gjs-element";
import type { DiffedProps } from "../utils/map-properties";

export class ApplicationElement {
  readonly kind = "APPLICATION";

  private rootElement: GjsElement<any> | string | null = null;

  constructor() {
    Gtk.init(null);
  }

  appendTo(parent: Gtk.Container): void {
    throw new Error("Application element can't be appended to a container.");
  }

  appendChild(child: string | GjsElement<any>): void {
    this.rootElement = child;
  }

  updateProps(props: DiffedProps): void {
    throw new Error("Application element can't have it's props be updated.");
  }

  remove(parent: GjsElement<any>): void {
    Gtk.main_quit();
  }

  render(): void {}

  start(): void {
    Gtk.main();
  }
}
