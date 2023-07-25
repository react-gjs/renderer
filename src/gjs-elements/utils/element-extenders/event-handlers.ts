import {
  EventPhase,
  EventPhaseController,
} from "../../../reconciler/event-phase";
import type { ElementLifecycle } from "../../element-extender";
import type { GjsElement } from "../../gjs-element";
import type { DiffedProps } from "./map-properties";
import { UnsetProp } from "./map-properties";

export type BindableProps<R extends Record<string, any>> = keyof {
  [K in keyof R as R[K] extends Function | undefined ? K : never]: K;
};

type EventConnect<K extends string, A extends any[]> = (
  signal: K,
  callback: (target: any, ...args: A) => boolean,
) => number;

type Widget<K extends string> = {
  connect: EventConnect<K, any[]>;
  disconnect: (id: number) => void;
};

type SyntheticEventPropsGenerator<A extends any[] = any[]> = (
  ...args: A
) => Record<string, any>;

export type SyntheticEvent<
  A extends Record<string, any> = {},
  T extends GjsElement = GjsElement,
> = A & {
  stopPropagation(): void;
  preventDefault(): void;
  originalEvent: any;
  target: T;
  targetWidget: ReturnType<T["getWidget"]>;
};

const isObject = (value: any): value is object =>
  typeof value === "object" && value != null;

const noop = () => {};

class EventBind {
  private id?: number;
  private isConnected = false;
  private handler: (event: SyntheticEvent) => any = noop;

  constructor(
    private element: { getWidget(): Widget<any> },
    private signal: string,
    private argGetter: SyntheticEventPropsGenerator<any> = () => ({}),
    private eventPhase: EventPhase = EventPhase.Input,
  ) {}

  private showAsyncWarning = () => {
    console.warn(
      "Provided an async function as an event handler. It is advised to only use synchronous functions as event handlers.",
    );

    // only show the warning the first time it's called
    this.showAsyncWarning = () => {};
  };

  init() {
    if (this.isConnected) return;

    this.id = this.element
      .getWidget()
      .connect(this.signal, (targetWidget: any, ...args: any[]) =>
        EventPhaseController.startPhase(this.eventPhase, () => {
          try {
            let propagate = true;

            const stopPropagation = () => {
              propagate = false;
            };

            const a = this.argGetter(...args);

            const syntheticEvent: SyntheticEvent<any> = Object.assign(
              {},
              a,
              {
                stopPropagation,
                preventDefault: stopPropagation,
                originalEvent: args[0],
                targetWidget: this.element.getWidget(),
                target: this.element,
              },
            );

            const handlerReturn = this.handler(syntheticEvent);

            if (
              isObject(handlerReturn) &&
              handlerReturn instanceof Promise
            ) {
              this.showAsyncWarning();
            }

            return !propagate;
          } catch (e) {
            // if argGetter throws it's a no-op
            if (isObject(e) && e instanceof EventNoop) {
              return false;
            }

            console.error(e);
            return false;
          }
        }),
      );

    this.isConnected = true;
  }

  updateHandler(handler?: (event: SyntheticEvent) => any) {
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
      this.element.getWidget().disconnect(this.id);
      this.isConnected = false;
    }
  }
}

/**
 * A helper class to bind props callbacks to the widget's `connect`.
 */
export class EventHandlers<
  W extends Widget<any>,
  P extends Record<string, any>,
> {
  private bindEvents = new Map<string, EventBind>();
  private internalBinds: Array<EventBind> = [];
  private listeners = new Map<string, Map<Function, EventBind>>();

  constructor(
    private element: {
      getWidget: () => W;
      lifecycle: ElementLifecycle;
    },
  ) {
    this.element.lifecycle.onUpdate((props) => this.update(props));
    this.element.lifecycle.beforeDestroy(() => {
      this.unbindAll();
    });
  }

  private update(props: DiffedProps) {
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

  private unbindAll() {
    this.bindEvents.forEach((bind) => bind.remove());
    this.internalBinds.forEach((bind) => bind.remove());
    this.bindEvents.clear();
    this.internalBinds = [];
  }

  bindInternal<K extends string, A extends any[]>(
    signal: K,
    handler: W["connect"] extends EventConnect<K, A>
      ? (event: SyntheticEvent) => void
      : never,
    eventPhase: EventPhase = EventPhase.Default,
  ) {
    const bind = new EventBind(
      this.element,
      signal,
      (...args) => args,
      eventPhase,
    );
    bind.updateHandler(handler);
    this.internalBinds.push(bind);
  }

  /**
   * Binds the function that this elements receives in the specified
   * "prop" to the signal type of the widget of this Element.
   *
   * @example
   *   handler.bind("clicked", "onClick");
   *   // This makes it so that all "clicked" signals from the
   *   // widget are forwarded to the "onClick" function that
   *   // exists of this element properties, if such prop is defined.
   */
  bind<K extends string, A extends any[]>(
    signal: K,
    propName: W["connect"] extends EventConnect<K, A>
      ? BindableProps<P>
      : never,
    getArgs?: SyntheticEventPropsGenerator<A>,
    eventPhase?: EventPhase,
  ) {
    this.bindEvents.set(
      propName as string,
      new EventBind(this.element, signal, getArgs, eventPhase),
    );
  }

  addListener(
    signal: string,
    callback: (widget: W, event?: unknown) => boolean | void,
  ) {
    const bind = new EventBind(this.element, signal, (e) => e);
    bind.updateHandler((event) => {
      const preventDefault = callback(
        this.element.getWidget(),
        event.originalEvent,
      );
      if (preventDefault) {
        event.stopPropagation();
      }
    });

    let signalListeners = this.listeners.get(signal);
    if (!signalListeners) {
      signalListeners = new Map();
      this.listeners.set(signal, signalListeners);
    }
    signalListeners.set(callback, bind);
  }

  removeListener(
    signal: string,
    callback: (widget: W, event?: unknown) => boolean | void,
  ) {
    const signalListeners = this.listeners.get(signal);
    if (!signalListeners) return;

    const bind = signalListeners.get(callback);
    if (!bind) return;

    bind.remove();
    signalListeners.delete(callback);
  }

  notifyWidgetDestroyedOutsideLifecycle() {
    this.bindEvents.clear();
    this.internalBinds = [];
  }
}

export class EventNoop extends Error {
  constructor() {
    super("EventNoop");
  }
}
