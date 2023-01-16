import type Gtk from "gi://Gtk";
import type { GjsElementTypes } from "./gjs-element-types";
import type { TextNode } from "./gtk3/markup/text-node";
import type { DiffedProps } from "./utils/element-extenders/map-properties";
import type { SyntheticEmitter } from "./utils/element-extenders/synthetic-emitter";

export interface GjsElement<
  K extends GjsElementTypes | "APPLICATION" = GjsElementTypes,
  W extends Gtk.Widget = Gtk.Widget
> {
  /**
   * String identifier that can be used to distinguis between
   * different GjsElement classes.
   */
  readonly kind: K;

  /** The Gtk Widget that is used to render the element. */
  widget: W;

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
  updateProps(props: DiffedProps): void;
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

  show(): void;

  hide(): void;

  diffProps(
    oldProps: Record<string, any>,
    newProps: Record<string, any>
  ): DiffedProps;
}
