/// <reference path="../gi.d.ts" />
/// <reference path="./gjs-elements/gjs-element-types.ts" />
/// <reference path="./gjs-elements/gjs-element.ts" />
/// <reference path="./gjs-elements/index.ts" />
// eslint-disable-next-line max-len
/// <reference path="./gjs-elements/utils/gdk-events/key-press-event.ts" />
/// <reference path="./gjs-elements/utils/icons/icon-types.ts" />
// eslint-disable-next-line max-len
/// <reference path="./hooks/gtk3/file-chooser-dialog/file-chooser-dialog.ts" />

import "gi://Gdk?version=3.0";
import "gi://Gtk?version=3.0";
import type { default as DeclarationTypes } from "./declarations";

import "./global-css";

export * from "./components";
export * from "./enums/gtk3-index";
export { GjsElementManager } from "./gjs-elements/gjs-element-manager";
export * from "./gjs-elements/gjs-element-types";
export { useApp } from "./gjs-elements/gtk3/application/context";
export type { ICustomWidget } from "./gjs-elements/index";
export type { MouseButtonPressEvent } from "./gjs-elements/utils/gdk-events/mouse-button-press-event";
export * from "./gjs-elements/utils/icons/icon-enum";
export * from "./gjs-elements/utils/icons/icon-types";
export * from "./gjs-elements/utils/theme-vars";
export * from "./hooks/gtk3";
export * from "./intrinsic-components";
export * from "./reconciler/jsx-types";
export * from "./reconciler/render";
export type { DeclarationTypes as GtkModules };
