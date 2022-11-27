import type Gtk from "gi://Gtk";
import type { GjsElement } from "../gjs-element";
import type { DiffedProps } from "../utils/element-extenders/map-properties";

export class TextNode {
  readonly kind = "TEXT_NODE";

  get widget(): Gtk.Widget {
    throw new Error("TextNode elements do not have widgets.");
  }

  private parent: GjsElement | null = null;

  constructor(private readonly text: string) {}

  updateProps(): void {}

  // #region This widget direct mutations

  appendChild(): void {}

  insertBefore(): void {}

  remove(parent: GjsElement): void {}

  render() {
    this.parent?.render();
  }

  // #endregion

  // #region Element internal signals

  notifyWillAppendTo(parent: GjsElement): void {
    this.parent = parent;
  }

  notifyWillUnmount() {}

  // #endregion

  // #region Utils for external use

  diffProps(): DiffedProps {
    return [];
  }

  // #endregion

  getText(): string {
    return this.text;
  }
}
