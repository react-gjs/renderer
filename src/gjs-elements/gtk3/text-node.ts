import type Gtk from "gi://Gtk";
import type { GjsContext } from "../../reconciler/gjs-renderer";
import type { HostContext } from "../../reconciler/host-context";
import type { GjsElement } from "../gjs-element";
import type { DiffedProps } from "../utils/element-extenders/map-properties";

export class TextNode {
  /** @internal */
  static isTextNode(element: any): element is TextNode {
    return (
      typeof element === "object" &&
      element !== null &&
      "kind" in element &&
      element.kind === "TEXT_NODE"
    );
  }

  static getContext(
    currentContext: HostContext<GjsContext>
  ): HostContext<GjsContext> {
    return currentContext;
  }

  readonly kind = "TEXT_NODE";

  private get widget(): Gtk.Widget {
    throw new Error("TextNode elements do not have widgets.");
  }

  private isVisible = true;
  private parent: GjsElement | null = null;

  constructor(private text: string) {}

  updateProps(): void {}

  // #region This widget direct mutations

  appendChild(): void {}

  insertBefore(): void {}

  remove(parent: GjsElement): void {
    this.parent?.notifyWillUnmount(this);
  }

  render() {
    this.parent?.render();
  }

  // #endregion

  // #region Element internal signals

  notifyWillAppendTo(parent: GjsElement): true {
    this.parent = parent;
    return true;
  }

  notifyWillUnmount() {}

  // #endregion

  // #region Utils for external use

  show() {
    this.isVisible = true;
    this.render();
  }

  hide() {
    this.isVisible = false;
    this.render();
  }

  diffProps(): DiffedProps {
    return [];
  }

  // #endregion

  getText(): string {
    if (this.isVisible) return this.text;
    else return "";
  }

  updateText(text: string): void {
    this.text = text;
    this.render();
  }
}
