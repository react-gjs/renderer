import type { AnyDataType, GetDataType } from "dilswer";
import { createValidator } from "dilswer";
import type { ElementLifecycle } from "../../element-extender";
import { OrderedMap } from "../ordered-map";

type KeysOf<P> = P extends P ? keyof P : never;

export type _PropsReader<P> = {
  [K in KeysOf<P>]?: P extends Record<K, infer T> ? T : never;
};

export type PropsReader<P> = _PropsReader<Required<P>>;

export type UpdateRedirect<P> = {
  instead(propertyName: KeysOf<P>): void;
};

export type PropCaseCollector<
  K extends string | symbol | number = string,
  P = {}
> = Record<
  K,
  <T extends AnyDataType>(
    type: T,
    mapper: (
      v: GetDataType<T> | undefined,
      allProps: PropsReader<P>,
      redirect: UpdateRedirect<P>
    ) => void | (() => void)
  ) => PropCaseCollector<K, P>
>;

export type DiffedProps = [propName: string, value: any][];

type MapEntry<P> = {
  propName: string;
  validate: (v: any) => boolean;
  callback: (
    v: any,
    props: PropsReader<P>,
    redirect: UpdateRedirect<P>
  ) => void | (() => void);
  nextCleanup?: () => void;
};

export const UnsetProp = Symbol("UnsetProp");

export class PropertyMapper<P = Record<string, any>> {
  private properties = {} as Record<string | symbol, any>;
  private map = new OrderedMap<string, MapEntry<P>>();

  currentProps = new Proxy(this.properties, {
    get: (target, prop) => target[prop],
    set: () => {
      throw new Error("These props are read-only.");
    },
  }) as PropsReader<P>;

  constructor(
    private element: ElementLifecycle,
    ...getMaps: Array<(caseCollector: PropCaseCollector<KeysOf<P>, P>) => void>
  ) {
    const caseCollector = new Proxy(
      {},
      {
        get: (_, propName: string) => {
          return (
            dataType: AnyDataType,
            callback: (
              value: GetDataType<AnyDataType>,
              allProps: PropsReader<P>
            ) => void | (() => void)
          ) => {
            this.map.set(propName, {
              propName,
              validate: createValidator(dataType),
              callback,
            });
            return caseCollector;
          };
        },
      }
    ) as PropCaseCollector<KeysOf<P>, P>;

    for (let i = 0; i < getMaps.length; i++) {
      getMaps[i](caseCollector);
    }

    // set default values
    for (const entry of this.map.values()) {
      entry.nextCleanup =
        entry.callback(undefined, this.currentProps, { instead: () => {} }) ??
        undefined;
    }

    this.element.onUpdate((props) => {
      this.update(props);
    });

    this.element.beforeDestroy(() => {
      this.cleanupAll();
    });
  }

  private update(props: DiffedProps) {
    const updated = new Map<string, [MapEntry<P>, any]>();

    for (let i = 0; i < props.length; i++) {
      const [propName, value] = props[i];
      const entry = this.map.get(propName);

      if (entry) {
        if (value === UnsetProp) {
          this.properties[propName] = undefined;
          updated.set(propName, [entry, undefined]);
        } else if (entry.validate(value)) {
          this.properties[propName] = value;
          updated.set(propName, [entry, value]);
        } else {
          console.error(
            new TypeError(
              `Invalid prop type. (${propName}) Received value: ${value}`
            )
          );
        }
      }
    }

    const updateEntry = (entry: MapEntry<P>, value: any) => {
      if (entry.nextCleanup) {
        entry.nextCleanup();
      }

      entry.nextCleanup =
        entry.callback(value, this.currentProps, redirect) ?? undefined;
    };

    const redirect: UpdateRedirect<P> = {
      instead: (propName) => {
        if (updated.has(propName as string)) {
          return; // no-op, mapping function was already called this cycle
        }
        updateEntry(
          this.map.get(propName as string)!,
          this.properties[propName as string]
        );
      },
    };

    for (const propName of this.map.keys()) {
      const [entry, value] = updated.get(propName) ?? [];
      if (entry) {
        updateEntry(entry, value);
      }
    }
  }

  private cleanupAll() {
    for (const entry of this.map.values()) {
      if (entry.nextCleanup) entry.nextCleanup();
    }

    this.map.clear();
  }
}
