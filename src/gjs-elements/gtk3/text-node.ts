import type Gtk from "gi://Gtk";
import type { GjsContext } from "../../reconciler/gjs-renderer";
import type { HostContext } from "../../reconciler/host-context";
import { BaseElement, type GjsElement } from "../gjs-element";
import type { DiffedProps } from "../utils/element-extenders/map-properties";

export class TextNode extends BaseElement {
  /** @internal */
  static isTextNode(element: any): element is TextNode {
    return (
      typeof element === "object"
      && element !== null
      && "kind" in element
      && element.kind === "TEXT_NODE"
    );
  }

  static getContext(
    currentContext: HostContext<GjsContext>,
  ): HostContext<GjsContext> {
    return currentContext;
  }

  readonly kind = "TEXT_NODE";

  protected get widget(): Gtk.Widget {
    throw new Error("TextNode elements do not have widgets.");
  }

  protected isVisible = true;
  protected parent: GjsElement | null = null;

  protected readonly lifecycle = null;
  protected readonly handlers = null;
  protected readonly propsMapper = null;

  constructor(protected text: string) {
    super();
  }

  updateProps(): void {}

  // #region This widget direct mutations

  appendChild(): void {}

  insertBefore(): void {}

  remove(parent: GjsElement): void {
    this.parent?.notifyChildWillUnmount(this);
  }

  render() {
    this.parent?.render();
  }

  // #endregion

  // #region Element internal signals

  notifyWillMountTo(parent: GjsElement): true {
    this.parent = parent;
    return true;
  }

  notifyMounted(): void {}

  notifyChildWillUnmount() {}

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
