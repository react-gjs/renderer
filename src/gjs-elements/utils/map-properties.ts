import type { AnyDataType, GetDataType } from "dilswer";
import { createValidator } from "dilswer";

export type PropMapper<K extends string | symbol | number = string> = Record<
  K,
  <T extends AnyDataType>(
    type: T,
    mapper: (v: GetDataType<T> | undefined) => void
  ) => PropMapper<K>
>;

export type DiffedProps = [propName: string, value: any][];

export const UnsetProp = Symbol("UnsetProp");

export const createPropMap = <P = Record<string, any>>(
  ...getMaps: Array<(sw: PropMapper<keyof P>) => void>
) => {
  const map = new Map<
    string,
    [validator: (v: any) => boolean, callback: (v: any) => void]
  >();

  const mapper = new Proxy(
    {},
    {
      get: (_, propName: string) => {
        return (
          dataType: AnyDataType,
          callback: (value: GetDataType<AnyDataType>) => void
        ) => {
          map.set(propName, [createValidator(dataType), callback]);
          return mapper;
        };
      },
    }
  ) as PropMapper<keyof P>;

  for (let i = 0; i < getMaps.length; i++) {
    getMaps[i](mapper);
  }

  return (props: DiffedProps) => {
    for (let i = 0; i < props.length; i++) {
      const [propName, value] = props[i];
      const entry = map.get(propName);
      if (entry) {
        const [validate, callback] = entry;

        if (value === UnsetProp) {
          callback(undefined);
        } else if (validate(value)) {
          callback(value);
        } else {
          console.error(new TypeError(`Invalid prop type. (${propName})`));
        }
      }
    }
  };
};
