import type { AnyDataType, GetDataType } from "dilswer";
import { ensureDataType } from "dilswer";

export type PropMapper<K extends string | symbol | number = string> = Record<
  K,
  <T extends AnyDataType>(
    type: T,
    mapper: (v: GetDataType<T>) => void
  ) => PropMapper<K>
>;

export const mapProperties = <P = Record<string, any>>(
  props: Record<string | number | symbol, any>
) => {
  const mapProp = (
    propName: string,
    type: AnyDataType,
    callback: (v: any) => void
  ) => {
    if (propName in props) {
      const value = props[propName];
      ensureDataType(type, value);
      callback(value);
    }
  };

  const mapper = new Proxy(
    {},
    {
      get: (_, propName: string) => {
        return (
          dataType: AnyDataType,
          callback: (value: GetDataType<AnyDataType>) => void
        ) => {
          mapProp(propName, dataType, callback);
          return mapper;
        };
      },
    }
  ) as PropMapper<keyof P>;

  return mapper;
};
