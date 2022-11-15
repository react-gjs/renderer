import type { DiffedProps } from "./map-properties";
import { UnsetProp } from "./map-properties";

export type BindableProps<R extends Record<string, any>> = keyof {
  [K in keyof R as R[K] extends Function | undefined ? K : never]: K;
};

type EventConnect<K extends string> = (signal: K, callback: any) => number;

type Widget<K extends string> = {
  connect: EventConnect<K>;
  disconnect: (id: number) => void;
};

const noop = () => {};

class EventBind {
  private id?: number;
  private isConnected = false;
  private handler: (...args: any[]) => any = noop;

  constructor(
    private widget: Widget<any>,
    private signal: string,
    private argGetter: (...args: any[]) => any[] = () => []
  ) {}

  init() {
    if (this.isConnected) return;

    this.id = this.widget.connect(this.signal, (_: any, ...args: any[]) => {
      try {
        const a = this.argGetter(...args);
        this.handler(...a);
      } catch (e) {
        // if argGetter throws it's a no-op
      }
    });

    this.isConnected = true;
  }

  updateHandler(handler?: (...args: any[]) => any) {
    if (handler) {
      this.init();
      this.handler = handler;
    } else {
      this.remove();
      this.handler = noop;
    }
  }

  remove() {
    if (this.id) {
      this.widget.disconnect(this.id);
      this.isConnected = false;
    }
  }
}

/**
 * A helper class to bind props callbacks to the widget's
 * `connect`.
 */
export class EventHandlers<
  W extends Widget<any>,
  P extends Record<string, any>
> {
  private bindEvents = new Map<string, EventBind>();
  private internalBinds: Array<EventBind> = [];

  constructor(private widget: W) {}

  bindInternal<K extends string>(
    signal: K,
    handler: W["connect"] extends EventConnect<K>
      ? (...args: any[]) => void
      : never
  ) {
    const bind = new EventBind(this.widget, signal, (...args) => args);
    bind.updateHandler(handler);
    this.internalBinds.push(bind);
  }

  bind<K extends string>(
    signal: K,
    propName: W["connect"] extends EventConnect<K> ? BindableProps<P> : never,
    getArgs?: (...args: any[]) => any[]
  ) {
    this.bindEvents.set(
      propName as string,
      new EventBind(this.widget, signal, getArgs)
    );
  }

  update(props: DiffedProps) {
    for (let i = 0; i < props.length; i++) {
      const [propName, propValue] = props[i];
      const bind = this.bindEvents.get(propName);

      if (bind) {
        if (typeof propValue === "function") {
          bind.updateHandler(propValue);
        }
        if (propValue === UnsetProp) {
          bind.updateHandler();
        }
      }
    }
  }

  unbindAll() {
    this.bindEvents.forEach((bind) => bind.remove());
    this.internalBinds.forEach((bind) => bind.remove());
  }
}
