import type { GjsContext } from "../reconciler/gjs-renderer";
import type { HostContext } from "../reconciler/host-context";
import type { GjsElement } from "./gjs-element";
import type { GjsElementTypes } from "./gjs-element-types";
import type { DiffedProps } from "./utils/element-extenders/map-properties";

export interface GjsElementConstructor<
  K extends GjsElementTypes | "APPLICATION"
> {
  new (props: DiffedProps, context: HostContext<GjsContext>): GjsElement<K>;

  getContext(currentContext: HostContext<GjsContext>): HostContext<GjsContext>;
}

export class GjsElementManager {
  private static elementKinds: string[] = [];
  private static elements = new Map<string, GjsElementConstructor<any>>();
  private static elementsReverseMap = new Map<object, string>();

  static register<K extends GjsElementTypes | "APPLICATION">(
    kind: K,
    element: GjsElementConstructor<K>
  ) {
    this.elementKinds.push(kind);
    this.elements.set(kind, element);
    this.elementsReverseMap.set(element, kind);
  }

  /** @internal */
  static create(
    kind: string,
    props: DiffedProps,
    context: HostContext<GjsContext>
  ) {
    const element = this.elements.get(kind);
    if (!element) {
      throw new Error(`Invalid element type: ${kind}`);
    }
    return new element(props, context);
  }

  static getContextForKind(
    kind: string,
    currentContext: HostContext<GjsContext>
  ) {
    const element = this.elements.get(kind);
    if (!element) {
      throw new Error(`Invalid element kind: ${kind}`);
    }
    return element.getContext(currentContext);
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
  static isGjsElementOfKind<E extends new (props: any) => any>(
    element: any,
    constructor: E | Array<E>
  ): element is InstanceType<E> {
    const constrList = Array.isArray(constructor) ? constructor : [constructor];

    for (const constr of constrList) {
      const kindName = this.elementsReverseMap.get(constr);
      if (this.isGjsElement(element) && element.kind === kindName) {
        return true;
      }
    }

    return false;
  }
}
