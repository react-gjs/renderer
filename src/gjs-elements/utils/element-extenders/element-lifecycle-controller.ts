import type { ElementLifecycle } from "../../element-extender";
import type { DiffedProps } from "./map-properties";

/**
 * Lifecycle controller is providing an interface that allows Element
 * extenders to hook into the lifecycle of the element.
 *
 * Whenever a major lifecycle change happens on the element, that
 * element should emit an appropriate event. Then extenders hooked
 * into those lifecycle events can execute appropriate for them
 * actions.
 */
export class ElementLifecycleController implements ElementLifecycle {
  private afterCreateCallback: (() => void) | null = null;
  private beforeDestroyCallback: (() => void) | null = null;
  private updateCallback: ((props: DiffedProps) => void) | null = null;

  afterCreate(hook: () => void): void {
    const currentHook = this.afterCreateCallback;

    this.afterCreateCallback = currentHook
      ? () => {
          currentHook();
          try {
            hook();
          } catch {
            // no-op
          }
        }
      : hook;
  }

  beforeDestroy(hook: () => void): void {
    const currentHook = this.beforeDestroyCallback;

    this.beforeDestroyCallback = currentHook
      ? () => {
          currentHook();
          try {
            hook();
          } catch {
            // no-op
          }
        }
      : hook;
  }

  onUpdate(hook: (props: DiffedProps) => void): void {
    const currentHook = this.updateCallback;

    this.updateCallback = currentHook
      ? (props) => {
          currentHook(props);
          try {
            hook(props);
          } catch {
            // no-op
          }
        }
      : hook;
  }

  emitLifecycleEventAfterCreate(): void {
    if (this.afterCreateCallback) this.afterCreateCallback();
    this.afterCreateCallback = null;
  }

  emitLifecycleEventBeforeDestroy(): void {
    if (this.beforeDestroyCallback) this.beforeDestroyCallback();
    this.beforeDestroyCallback = null;
    this.afterCreateCallback = null;
    this.updateCallback = null;
  }

  emitLifecycleEventUpdate(props: DiffedProps): void {
    if (this.updateCallback) this.updateCallback(props);
  }
}
