import type Gtk from "gi://Gtk?version=3.0";
import type { GjsElementTypes } from "../reconciler/gjs-element-types";

export interface GjsElement {
  readonly kind: GjsElementTypes | "APPLICATION";

  appendTo(parent: Gtk.Container): void;
  appendChild(child: GjsElement | string): void;
  updateProps(props: object): void;
  remove(parent: GjsElement): void;

  render(): void;
}
