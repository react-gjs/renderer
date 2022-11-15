import type Gtk from "gi://Gtk?version=3.0";
import type { GjsElementTypes } from "./gjs-element-types";
import type { DiffedProps } from "./utils/map-properties";
import type { SyntheticEmitter } from "./utils/synthetic-emitter";

export interface GjsElement<K extends GjsElementTypes | "APPLICATION"> {
  readonly kind: K;

  appendTo(parent: Gtk.Container): void;
  appendChild(child: GjsElement<any> | string): void;
  updateProps(props: DiffedProps): void;
  remove(parent: GjsElement<any>): void;

  render(): void;

  emitter?: SyntheticEmitter<any>;
}
