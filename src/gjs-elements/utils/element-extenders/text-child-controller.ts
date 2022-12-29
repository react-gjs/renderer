import type { ElementLifecycle } from "../../element-extender";
import type { GjsElement } from "../../gjs-element";
import type { TextNode } from "../../gtk3/markup/text-node";

export class TextChildController {
  private previousText = "";
  private children: TextNode[] = [];

  constructor(
    private element: ElementLifecycle,
    private setWidgetText: (text: string) => void
  ) {}

  private getText() {
    return this.children.map((c) => c.getText()).join("");
  }

  update() {
    const text = this.getText();

    if (this.previousText === text) {
      return;
    }

    this.setWidgetText(text);
    this.previousText = text;
  }

  count() {
    return this.children.length;
  }

  addChild(child: TextNode) {
    this.children.push(child);
    this.update();
  }

  removeChild(child: TextNode | GjsElement) {
    this.children = this.children.filter((c) => c !== child);
    this.update();
  }

  insertBefore(newChild: TextNode, beforeChild: GjsElement | TextNode) {
    const beforeIndex = this.children.findIndex((c) => c === beforeChild);

    if (beforeIndex === -1) {
      throw new Error("beforeChild not found in the children list");
    }

    this.children.splice(beforeIndex, 0, newChild);
  }
}
