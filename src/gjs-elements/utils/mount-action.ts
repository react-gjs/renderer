import type { GjsElement } from "../gjs-element";
import type { TextNode } from "../gtk3/text-node";

export const mountAction = (
  parent: GjsElement,
  child: GjsElement | TextNode,
  action: (omitMount: boolean) => void,
  afterMount = () => {},
) => {
  const shouldBeMounted = child.notifyWillMountTo(parent);
  action(!shouldBeMounted);
  if (shouldBeMounted) {
    child.notifyMounted();
    afterMount();
  }
};
