import type Gtk from "gi://Gtk";
import type { TextNode } from "./gtk3/text-node";
import type { DiffedProps } from "./utils/element-extenders/map-properties";
import type { SyntheticEmitter } from "./utils/element-extenders/synthetic-emitter";

export interface GjsElement<
  K extends Rg.GjsElementTypes | "APPLICATION" = Rg.GjsElementTypes,
  W extends Gtk.Widget = Gtk.Widget
> {
  /**
   * String identifier that can be used to distinguis between
   * different GjsElement classes.
   */
  readonly kind: K;
  /** The Gtk Widget that is used to render the element. */
  getWidget(): W;
  /**
   * This function is called by it's parent element before it is
   * appended to it. It should return a boolean value that indicates
   * if the element is allowed to be appended to the parent. This
   * should be `true` for most elements, with the exception for the
   * Top-Level-Elements like `Window`.
   */
  notifyWillAppendTo(parent: GjsElement | TextNode): boolean;
  /**
   * This function is called by the child element before it removes
   * itself.
   */
  notifyWillUnmount(child: GjsElement | TextNode): void;
  /**
   * This function is called by the React Reconciler when a new
   * element instance is to be added to this element.
   */
  appendChild(child: GjsElement | TextNode): void;
  /**
   * This function is called by the React Reconciler when the React
   * provided props are updated.
   *
   * Props are already diffed against the props from the previous
   * render cycle.
   */
  insertBefore(
    newChild: GjsElement | TextNode,
    beforeChild: GjsElement | TextNode
  ): void;
  /**
   * This function is called by the React Reconciler when the React
   * provided props are updated.
   */
  updateProps(props: DiffedProps): void;
  /**
   * Sets the value of element's property whose name is `key` to the
   * given value.
   */
  setProperty(key: string, value: any): void;
  /** Returns the value of element's property whose name is `key`. */
  getProperty(key: string): any;
  /**
   * Returns the element's parent element or `null` if the element has
   * no parent.
   */
  getParentElement(): GjsElement | null;
  /** Attaches a listener to the element Widget for a given signal. */
  addEventListener(
    signal: string,
    callback: Rg.GjsElementEvenTListenerCallback
  ): void;
  /** Detaches a listener from the element Widget for a given signal. */
  removeEventListener(
    signal: string,
    callback: Rg.GjsElementEvenTListenerCallback
  ): void;
  /**
   * This function is called by the React Reconciler when the element
   * is to be removed from it's parent.
   */
  remove(parent: GjsElement): void;
  /**
   * This function is called by the React Reconciler after mutating
   * the element via `appendChild`, 'updateProps`or`remove`.
   */
  render(): void;
  /**
   * Some GjsElement implementation might have a Event Emitter that is
   * used by the Elements internally.
   *
   * This interface is for example used by the FlowBox Element and the
   * FlowBoxEntry Element, to communicate with each other when a item
   * is selected.
   */
  emitter?: SyntheticEmitter<any>;
  /**
   * This function is called by the React Reconciler when the element
   * is to be made visible again after being hidden.
   */
  show(): void;
  /**
   * This function is called by the React Reconciler when the element
   * is to be hidden.
   */
  hide(): void;
  /**
   * This function is called by the React Reconciler to diff the old
   * props against the current ones. The result of this function will
   * be later passed to `updateProps` method.
   */
  diffProps(
    oldProps: Record<string, any>,
    newProps: Record<string, any>
  ): DiffedProps;
}

type GjsElementAlias = GjsElement;

declare global {
  namespace Rg {
    type GjsElement = GjsElementAlias;
    type GjsElementEvenTListenerCallback<W extends Gtk.Widget = Gtk.Widget> = (
      widget: W,
      event?: unknown
    ) => boolean | void;
  }
}
