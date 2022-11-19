import GObject from "gi://GObject";
import Gtk from "gi://Gtk";

export class OptionsList {
  private listStore = new Gtk.ListStore();
  private textRenderer = new Gtk.CellRendererText();
  private comboBox: Gtk.ComboBox;

  private currentOptions: Array<{
    id: number;
    label: string;
    value: any;
  }> = [];

  constructor() {
    this.listStore.set_column_types([GObject.TYPE_STRING, GObject.TYPE_INT]);

    this.comboBox = new Gtk.ComboBox({
      model: this.listStore,
    });
    this.comboBox.pack_start(this.textRenderer, true);
    this.comboBox.add_attribute(this.textRenderer, "text", 0);
  }

  getComboBox() {
    return this.comboBox;
  }

  clear() {
    this.listStore.clear();
    this.currentOptions = [];
  }

  add(label: string, value: any) {
    const index = this.currentOptions.length;

    const iter = this.listStore.append();
    this.listStore.set(iter, [0, 1], [label, index]);
    this.currentOptions.push({ id: index, label, value });
  }

  getOptionForIter(iter: Gtk.TreeIter) {
    const index = this.listStore.get_value(iter, 1) as any as number;
    return { value: this.currentOptions[index].value, index };
  }
}
