import type { AnyDataType, GetDataType } from "dilswer";
import { createValidator } from "dilswer";
import type { ElementLifecycle } from "../../element-extender";
import type { WindowElement } from "../../rg-types";
import { OrderedMap } from "../ordered-map";

type KeysOf<P> = P extends P ? keyof P : never;

export type _PropsReader<P> = {
  [K in KeysOf<P>]?: P extends Record<K, infer T> ? T : never;
};

export type PropsReader<P> = _PropsReader<Required<P>> & {
  __rg_parent_window?: WindowElement;
};

export type MapperUpdateApi<P> = {
  instead(propertyName: KeysOf<P>): void;
  isUpdatedInThisCycle(propertyName: KeysOf<P>): boolean;
};

export type PropCaseCollector<
  K extends string | symbol | number = string,
  P = {},
> = Record<
  K,
  <T extends AnyDataType>(
    type: T,
    mapper: (
      v: GetDataType<T> | undefined,
      allProps: PropsReader<P>,
      mapperUpdateApi: MapperUpdateApi<P>,
    ) => void | (() => void),
  ) => PropCaseCollector<K, P>
>;

export type DiffedProps = [propName: string, value: any][];

type MapEntry<P> = {
  propName: string;
  validate: (v: any) => boolean;
  callback: (
    v: any,
    props: PropsReader<P>,
    mapperUpdateApi: MapperUpdateApi<P>,
  ) => void | (() => void);
  nextCleanup?: () => void;
};

export const UnsetProp = Symbol("UnsetProp");

export class PropertyMapper<P = Record<string, any>> {
  private properties = {} as Record<string | symbol, any>;
  private map = new OrderedMap<string, MapEntry<P>>();
  private isFirstUpdate = true;

  currentProps = new Proxy(this.properties, {
    get: (target, prop) => target[prop],
    set: () => {
      throw new Error("These props are read-only.");
    },
  }) as PropsReader<P>;

  constructor(
    private element: ElementLifecycle,
    ...getCases: Array<
      (caseCollector: PropCaseCollector<KeysOf<P>, P>) => void
    >
  ) {
    this.addCases(...getCases);

    this.element.onUpdate((props) => {
      this.update(props);
    });

    this.element.beforeDestroy(() => {
      this.cleanupAll();
    });
  }

  addCases(
    ...getCases: Array<
      (caseCollector: PropCaseCollector<KeysOf<P>, P>) => void
    >
  ) {
    const caseCollector = new Proxy(
      {},
      {
        get: (_, propName: string) => {
          return (
            dataType: AnyDataType,
            callback: (
              value: GetDataType<AnyDataType>,
              allProps: PropsReader<P>,
            ) => void | (() => void),
          ) => {
            this.map.set(propName, {
              propName,
              validate: createValidator(dataType),
              callback,
            });
            return caseCollector;
          };
        },
      },
    ) as PropCaseCollector<KeysOf<P>, P>;

    for (let i = 0; i < getCases.length; i++) {
      getCases[i](caseCollector);
    }
  }

  private update(props: DiffedProps) {
    const updated = new Map<string, [MapEntry<P>, any]>();

    // collect props that need to be updated
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
              `Invalid prop type. (${propName}) Received value: ${value}`,
            ),
          );
        }
      } else {
        this.properties[propName] = value;
      }
    }

    try {
      for (const [entry] of updated.values()) {
        entry.nextCleanup?.();
      }
    } catch (e) {
      console.error("Property cleanup callback failed.", e);
    }

    const updateEntry = (entry: MapEntry<P>, value: any) => {
      try {
        entry.nextCleanup =
          entry.callback(value, this.currentProps, mapperUpdateApi) ??
          undefined;
      } catch (e) {
        console.error("Failed to apply a property update.", e);
      }
    };

    const mapperUpdateApi: MapperUpdateApi<P> = {
      instead: (propName) => {
        if (updated.has(propName as string)) {
          return; // no-op, mapping function was already called this cycle
        }
        const entry = this.map.get(propName as string)!;
        entry.nextCleanup?.();
        updateEntry(entry, this.properties[propName as string]);
      },
      isUpdatedInThisCycle: (propName) =>
        updated.has(propName as string),
    };

    if (this.isFirstUpdate) {
      this.isFirstUpdate = false;

      for (const propName of this.map.keys()) {
        // eslint-disable-next-line prefer-const
        let [entry, value] = updated.get(propName) ?? [];
        if (entry) {
          updateEntry(entry, value);
        } else {
          entry = this.map.get(propName)!;
          try {
            entry.nextCleanup =
              entry.callback(undefined, this.currentProps, {
                instead: () => {},
                isUpdatedInThisCycle: () => true,
              }) ?? undefined;
          } catch (e) {
            console.error("Failed to apply a property update.", e);
          }
        }
      }
    } else {
      for (const propName of this.map.keys()) {
        const [entry, value] = updated.get(propName) ?? [];
        if (entry) {
          updateEntry(entry, value);
        }
      }
    }
  }

  private cleanupAll() {
    for (const entry of this.map.values()) {
      if (entry.nextCleanup) entry.nextCleanup();
    }

    this.map.clear();
  }

  skipDefaults() {
    this.isFirstUpdate = false;
  }

  get(key: string) {
    return this.properties[key];
  }
}
