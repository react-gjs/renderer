import Gtk from "gi://Gtk";
import type { GjsElement } from "../gjs-element";
import { diffProps } from "../utils/diff-props";
import type { DiffedProps } from "../utils/element-extenders/map-properties";

export class ApplicationElement {
  readonly kind = "APPLICATION";

  private rootElement: GjsElement | null = null;

  constructor() {
    Gtk.init(null);
  }

  notifyWillAppendTo(parent: GjsElement): void {
    throw new Error("Application element can't be appended to a container.");
  }

  appendChild(child: GjsElement): void {
    this.rootElement = child;
  }

  updateProps(props: DiffedProps): void {
    throw new Error("Application element can't have it's props be updated.");
  }

  notifyWillUnmount() {}

  remove(): void {
    Gtk.main_quit();
  }

  render(): void {
    this.rootElement?.render();
  }

  start(): void {
    return Gtk.main();
  }

  clear() {
    this.rootElement?.remove(this as any);
    this.rootElement = null;
  }

  show() {}

  hide() {}

  diffProps(
    oldProps: Record<string, any>,
    newProps: Record<string, any>
  ): DiffedProps {
    return diffProps(oldProps, newProps, true);
  }
}
