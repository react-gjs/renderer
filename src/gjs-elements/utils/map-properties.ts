import type { AnyDataType, GetDataType } from "dilswer";
import { createValidator } from "dilswer";

type KeysOf<P> = P extends P ? keyof P : never;

export type PropsReader<P> = {
  [K in KeysOf<P>]?: P extends Record<K, infer T> ? T : never;
};

export type UpdateRedirect<P> = {
  instead(propertyName: KeysOf<P>): void;
};

export type PropMapper<
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
  ) => PropMapper<K, P>
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

export const createPropMap = <P = Record<string, any>>(
  ...getMaps: Array<(sw: PropMapper<KeysOf<P>, P>) => void>
) => {
  const currentProps = {} as any;
  const propsReader = new Proxy(currentProps, {
    get: (target, prop) => target[prop],
    set: () => {
      throw new Error("These props are read-only.");
    },
  });

  const map = new Map<string, MapEntry<P>>();

  const mapper = new Proxy(
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
          map.set(propName, {
            propName,
            validate: createValidator(dataType),
            callback,
          });
          return mapper;
        };
      },
    }
  ) as PropMapper<KeysOf<P>, P>;

  for (let i = 0; i < getMaps.length; i++) {
    getMaps[i](mapper);
  }

  const update = (props: DiffedProps) => {
    const updated: Array<[MapEntry<P>, any]> = [];

    for (let i = 0; i < props.length; i++) {
      const [propName, value] = props[i];
      const entry = map.get(propName);

      if (entry) {
        if (value === UnsetProp) {
          currentProps[propName] = undefined;
          updated.push([entry, undefined]);
        } else if (entry.validate(value)) {
          currentProps[propName] = value;
          updated.push([entry, value]);
        } else {
          console.error(new TypeError(`Invalid prop type. (${propName})`));
        }
      }
    }

    const updateEntry = (entry: MapEntry<P>, value: any) => {
      if (entry.nextCleanup) {
        entry.nextCleanup();
      }

      entry.nextCleanup =
        entry.callback(value, propsReader, redirect) ?? undefined;
    };

    const redirect: UpdateRedirect<P> = {
      instead: (propName) => {
        if (updated.some(([entry]) => entry.propName === propName)) {
          return; // no-op, mapping function was already called this cycle
        }
        updateEntry(map.get(propName as string)!, currentProps[propName]);
      },
    };

    for (let i = 0; i < updated.length; i++) {
      const [entry, value] = updated[i];
      updateEntry(entry, value);
    }
  };

  // set default values
  for (const entry of map.values()) {
    entry.nextCleanup =
      entry.callback(undefined, propsReader, { instead: () => {} }) ??
      undefined;
  }

  const cleanupAll = () => {
    for (const entry of map.values()) {
      if (entry.nextCleanup) entry.nextCleanup();
    }
  };

  return { update, cleanupAll, currentProps: propsReader as PropsReader<P> };
};
