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
  private updateCallbacks: ((props: DiffedProps) => void)[] = [];
  private afterCreateCallbacks: (() => void)[] = [];
  private beforeDestroyCallbacks: (() => void)[] = [];
  private mountedCallbacks: (() => void)[] = [];
  private unmountedCallbacks: (() => void)[] = [];

  onAfterCreate(cb: () => void): void {
    this.afterCreateCallbacks.push(cb);
  }

  onBeforeDestroy(cb: () => void): void {
    this.beforeDestroyCallbacks.push(cb);
  }

  onUpdate(cb: (props: DiffedProps) => void): void {
    this.updateCallbacks.push(cb);
  }

  onMounted(cb: () => void): void {
    this.mountedCallbacks.push(cb);
  }

  onUnmounted(cb: () => void): void {
    this.unmountedCallbacks.push(cb);
  }

  offAfterCreate(cb: () => void): void {
    const index = this.afterCreateCallbacks.indexOf(cb);
    if (index !== -1) {
      this.afterCreateCallbacks.splice(index, 1);
    }
  }

  offBeforeDestroy(cb: () => void): void {
    const index = this.beforeDestroyCallbacks.indexOf(cb);
    if (index !== -1) {
      this.beforeDestroyCallbacks.splice(index, 1);
    }
  }

  offUpdate(cb: (props: DiffedProps) => void): void {
    const index = this.updateCallbacks.indexOf(cb);
    if (index !== -1) {
      this.updateCallbacks.splice(index, 1);
    }
  }

  offMounted(cb: () => void): void {
    const index = this.mountedCallbacks.indexOf(cb);
    if (index !== -1) {
      this.mountedCallbacks.splice(index, 1);
    }
  }

  offUnmounted(cb: () => void): void {
    const index = this.unmountedCallbacks.indexOf(cb);
    if (index !== -1) {
      this.unmountedCallbacks.splice(index, 1);
    }
  }

  emitLifecycleEventAfterCreate(): void {
    for (let i = 0; i < this.afterCreateCallbacks.length; i++) {
      try {
        this.afterCreateCallbacks[i]();
      } catch (e) {
        console.error(e);
      }
    }
    this.afterCreateCallbacks = [];
  }

  emitLifecycleEventBeforeDestroy(): void {
    for (let i = 0; i < this.beforeDestroyCallbacks.length; i++) {
      try {
        this.beforeDestroyCallbacks[i]();
      } catch (e) {
        console.error(e);
      }
    }
    this.beforeDestroyCallbacks = [];
    this.afterCreateCallbacks = [];
    this.updateCallbacks = [];
  }

  emitLifecycleEventUpdate(props: DiffedProps): void {
    for (let i = 0; i < this.updateCallbacks.length; i++) {
      try {
        this.updateCallbacks[i](props);
      } catch (e) {
        console.error(e);
      }
    }
  }

  emitMountedEvent(): void {
    for (let i = 0; i < this.mountedCallbacks.length; i++) {
      try {
        this.mountedCallbacks[i]();
      } catch (e) {
        console.error(e);
      }
    }
  }

  emitUnmountedEvent(): void {
    for (let i = 0; i < this.unmountedCallbacks.length; i++) {
      try {
        this.unmountedCallbacks[i]();
      } catch (e) {
        console.error(e);
      }
    }
  }
}
