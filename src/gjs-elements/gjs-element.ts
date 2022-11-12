import type Gtk from "gi://Gtk?version=3.0";
import type { GjsElementTypes } from "../reconciler/gjs-element-types";
import type { DiffedProps } from "./utils/map-properties";

export interface GjsElement {
  readonly kind: GjsElementTypes | "APPLICATION";

  appendTo(parent: Gtk.Container): void;
  appendChild(child: GjsElement | string): void;
  updateProps(props: DiffedProps): void;
  remove(parent: GjsElement): void;

  render(): void;
}
