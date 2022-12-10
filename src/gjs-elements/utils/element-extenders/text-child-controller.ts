import type { ElementLifecycle } from "../../element-extender";
import type { GjsElement } from "../../gjs-element";
import type { TextNode } from "../../markup/text-node";

export class TextChildController {
  private children: TextNode[] = [];

  constructor(
    private element: ElementLifecycle,
    private setWidgetText: (text: string) => void
  ) {
    this.addChild = (child: TextNode) => {
      this.children.push(child);
      this.update();
    };
  }

  private getText() {
    return this.children.map((c) => c.getText()).join("");
  }

  update() {
    this.setWidgetText(this.getText());
  }

  count() {
    return this.children.length;
  }

  addChild: (text: TextNode) => void;

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
