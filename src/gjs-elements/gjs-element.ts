import type Gtk from "gi://Gtk";
import type { GjsElementTypes } from "./gjs-element-types";
import type { DiffedProps } from "./utils/map-properties";
import type { SyntheticEmitter } from "./utils/synthetic-emitter";

export interface GjsElement<
  K extends GjsElementTypes | "APPLICATION" = GjsElementTypes,
  W extends Gtk.Widget = Gtk.Widget
> {
  readonly kind: K;

  widget: W;

  notifyWillAppendTo(parent: GjsElement): void;
  appendChild(child: GjsElement | string): void;
  updateProps(props: DiffedProps): void;
  remove(parent: GjsElement): void;

  render(): void;

  emitter?: SyntheticEmitter<any>;
}
