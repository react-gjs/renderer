//
/// <reference path="./Atk.d.ts" />;
/// <reference path="./Cairo.d.ts" />;
/// <reference path="./Gdk.d.ts" />;
/// <reference path="./GdkPixbuf.d.ts" />;
/// <reference path="./Gio.d.ts" />;
/// <reference path="./GLib.d.ts" />;
/// <reference path="./GModule.d.ts" />;
/// <reference path="./GObject.d.ts" />;
/// <reference path="./Gtk.d.ts" />;
/// <reference path="./Pango.d.ts" />;
/// <reference path="./Soup.d.ts" />;
/// <reference path="./system.d.ts" />;

declare module "gi://Atk" {}
declare module "gi://cairo" {}
declare module "gi://Gdk" {}
declare module "gi://GdkPixbuf" {}
declare module "gi://Gio" {}
declare module "gi://GLib" {}
declare module "gi://GModule" {}
declare module "gi://GObject" {}
declare module "gi://Gtk" {}
declare module "gi://Pango" {}
declare module "gi://Soup" {}
declare module "system" {}

declare module "gi://Gtk?version=3.0" {
  import Gtk from "gi://Gtk";
  export default Gtk;
}

declare module "gi://Gdk?version=3.0" {
  import Gdk from "gi://Gdk";
  export default Gdk;
}
