import type { GjsElementTypes } from "../reconciler/gjs-element-types";
import type { GjsElement } from "./gjs-element";
import type { DiffedProps } from "./utils/map-properties";

export interface GjsElementConstructor<
  K extends GjsElementTypes | "APPLICATION"
> {
  new (props: DiffedProps): GjsElement<K>;
}

export class GjsElementManager {
  static elements = new Map<string, GjsElementConstructor<any>>();
  static elementKinds: string[] = [];

  static register<K extends GjsElementTypes | "APPLICATION">(
    kind: K,
    element: GjsElementConstructor<K>
  ) {
    this.elements.set(kind, element);
    this.elementKinds.push(kind);
  }

  static create(kind: string, props: DiffedProps) {
    const element = this.elements.get(kind);
    if (!element) {
      throw new Error(`Invalid element type: ${kind}`);
    }
    return new element(props);
  }

  static isValidKind(kind: string) {
    return this.elements.has(kind);
  }

  static isGjsElement(element: any): element is GjsElement<any> {
    return (
      typeof element === "object" &&
      element !== null &&
      "kind" in element &&
      this.elementKinds.includes(element.kind)
    );
  }
}
