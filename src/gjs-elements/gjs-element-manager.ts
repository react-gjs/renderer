import type { GjsElement } from "./gjs-element";
import type { GjsElementTypes } from "./gjs-element-types";
import type { DiffedProps } from "./utils/element-extenders/map-properties";

export interface GjsElementConstructor<
  K extends GjsElementTypes | "APPLICATION"
> {
  new (props: DiffedProps): GjsElement<K>;
}

export class GjsElementManager {
  private static elementKinds: string[] = [];
  private static elements = new Map<string, GjsElementConstructor<any>>();
  private static elementsReverseMap = new Map<
    GjsElementConstructor<any>,
    string
  >();

  static register<K extends GjsElementTypes | "APPLICATION">(
    kind: K,
    element: GjsElementConstructor<K>
  ) {
    this.elementKinds.push(kind);
    this.elements.set(kind, element);
    this.elementsReverseMap.set(element, kind);
  }

  /** @internal */
  static create(kind: string, props: DiffedProps) {
    const element = this.elements.get(kind);
    if (!element) {
      throw new Error(`Invalid element type: ${kind}`);
    }
    return new element(props);
  }

  /** @internal */
  static isValidKind(kind: string) {
    return this.elements.has(kind);
  }

  /** @internal */
  static isGjsElement(element: any): element is GjsElement {
    return (
      typeof element === "object" &&
      element !== null &&
      "kind" in element &&
      this.elementKinds.includes(element.kind)
    );
  }

  /** @internal */
  static isGjsElementOfKind<E extends GjsElement>(
    element: any,
    constructor: new (props: any) => E
  ): element is E {
    const kindName = this.elementsReverseMap.get(constructor);
    return this.isGjsElement(element) && element.kind === kindName;
  }
}
