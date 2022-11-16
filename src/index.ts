import "gi://Gdk?version=3.0";
import "gi://Gtk?version=3.0";
import type { default as GtkModules } from "./gtk-modules-declarations";

export * from "./g-enums";
export { GjsElementManager } from "./gjs-elements/gjs-element-manager";
export * from "./gjs-elements/gjs-element-types";
export { KeyPressModifiers } from "./gjs-elements/utils/parse-event-key";
export * from "./intrinsic-components";
export * from "./process-exit";
export * from "./reconciler/index";
export * from "./reconciler/jsx-types";
export type { GtkModules };
