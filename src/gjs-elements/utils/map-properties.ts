import type { AnyDataType, GetDataType } from "dilswer";
import { createValidator } from "dilswer";

export type PropMapper<K extends string | symbol | number = string> = Record<
  K,
  <T extends AnyDataType>(
    type: T,
    mapper: (v: GetDataType<T> | undefined) => void | (() => void)
  ) => PropMapper<K>
>;

export type DiffedProps = [propName: string, value: any][];

export const UnsetProp = Symbol("UnsetProp");

export const createPropMap = <P = Record<string, any>>(
  ...getMaps: Array<(sw: PropMapper<keyof P>) => void>
) => {
  const currentProps = {} as any;

  const map = new Map<
    string,
    {
      validate: (v: any) => boolean;
      callback: (v: any) => void | (() => void);
      nextCleanup?: () => void;
    }
  >();

  const mapper = new Proxy(
    {},
    {
      get: (_, propName: string) => {
        return (
          dataType: AnyDataType,
          callback: (value: GetDataType<AnyDataType>) => void | (() => void)
        ) => {
          map.set(propName, { validate: createValidator(dataType), callback });
          return mapper;
        };
      },
    }
  ) as PropMapper<keyof P>;

  for (let i = 0; i < getMaps.length; i++) {
    getMaps[i](mapper);
  }

  const update = (props: DiffedProps) => {
    for (let i = 0; i < props.length; i++) {
      const [propName, value] = props[i];
      const entry = map.get(propName);
      if (entry) {
        if (value === UnsetProp) {
          currentProps[propName] = undefined;
          if (entry.nextCleanup) entry.nextCleanup();
          entry.nextCleanup = entry.callback(undefined) ?? undefined;
        } else if (entry.validate(value)) {
          currentProps[propName] = value;
          if (entry.nextCleanup) entry.nextCleanup();
          entry.nextCleanup = entry.callback(value) ?? undefined;
        } else {
          console.error(new TypeError(`Invalid prop type. (${propName})`));
        }
      }
    }
  };

  // set default values
  for (const entry of map.values()) {
    entry.nextCleanup = entry.callback(undefined) ?? undefined;
  }

  const cleanupAll = () => {
    for (const entry of map.values()) {
      if (entry.nextCleanup) entry.nextCleanup();
    }
  };

  return { update, cleanupAll, currentProps };
};
