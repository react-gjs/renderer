import GObject from "gi://GObject";
import Gtk from "gi://Gtk";

export class Bin extends Gtk.Bin {
  _init(...params: any[]) {
    // @ts-ignore
    super._init(...params);
  }
}

GObject.registerClass(Bin);
