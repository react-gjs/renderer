export const InstinsicElementSymbol = Symbol("IntrinsicElement");

export const isInstrinsic = (
  v: string | React.JSXElementConstructor<any>,
): v is React.FC => {
  return !!(
    (typeof v === "function" || typeof v === "object")
    && v != null
    // @ts-expect-error
    && v[InstinsicElementSymbol]
  );
};

export const markAsIntrinsic = (
  component: React.FC<any>,
  name: string,
) => {
  component.displayName = `Intrinsic_${name}`;

  Object.defineProperty(component, InstinsicElementSymbol, {
    value: true,
    configurable: false,
    writable: false,
  });

  return component;
};
