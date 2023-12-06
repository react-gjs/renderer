import type { DiffedProps } from "./utils/element-extenders/map-properties";

/**
 * This interface provides methods that are available to Element
 * Extenders and allow for hooking into the lifecycle of the element.
 */
export interface ElementLifecycle {
  /**
   * Hooks into the `create` lifecycle event. This event is emitted
   * only once, when the element is created.
   */
  onAfterCreate(cb: () => void): void;
  /**
   * Hooks into the `destroy` lifecycle event. This event is emitted
   * only once, before the element is destroyed.
   */
  onBeforeDestroy(cb: () => void): void;
  /**
   * Hooks into the `propsUpdated` lifecycle event. This event is
   * emitted whenever the element's props change.
   */
  onUpdate(cb: (props: DiffedProps) => void): void;
  /**
   * Hooks into the `mounted` lifecycle event. This event is emitted
   * after the element is mounted into a parent.
   */
  onMounted(cb: () => void): void;
  /** Removes the callback from the `create` lifecycle event. */
  offAfterCreate(cb: () => void): void;
  /** Removes the callback from the `destroy` lifecycle event. */
  offBeforeDestroy(cb: () => void): void;
  /** Removes the callback from the `propsUpdated` lifecycle event. */
  offUpdate(cb: (props: DiffedProps) => void): void;
  /** Removes the callback from the `mounted` lifecycle event. */
  offMounted(cb: () => void): void;
}
