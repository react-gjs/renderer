import type { DiffedProps } from "./utils/element-extenders/map-properties";

/**
 * This interface provides methods that are available to Element
 * Extenders and allow for hooking into the lifecycle of the
 * element.
 */
export interface ElementLifecycle {
  /**
   * Hooks into the `create` lifecycle event. This event is
   * emitted only once, when the element is created.
   *
   * Hooks, after being added, are managed internally only, and
   * cannot be removed manually.
   */
  afterCreate(hook: () => void): void;
  /**
   * Hooks into the `destroy` lifecycle event. This event is
   * emitted only once, before the element is destroyed.
   *
   * Hooks, after being added, are managed internally only, and
   * cannot be removed manually.
   */
  beforeDestroy(hook: () => void): void;
  /**
   * Hooks into the `propsUpdated` lifecycle event. This event is
   * emitted whenever the element's props change.
   *
   * Hooks, after being added, are managed internally only, and
   * cannot be removed manually.
   */
  onUpdate(hook: (props: DiffedProps) => void): void;
}
