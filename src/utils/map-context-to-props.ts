import React from "react";

type ContextMapper<C> = [React.Context<C>, (context: C) => Record<string, any>];

type Middleware = <E extends keyof JSX.IntrinsicElements>(
  component: React.FC<JSX.IntrinsicElements[E]>
) => React.FC<JSX.IntrinsicElements[E]>;

export const mapContextToProps = <E extends keyof JSX.IntrinsicElements>(
  v: E
) => {
  const maps: ContextMapper<any>[] = [];
  const middleware: Middleware[] = [];

  return {
    mapCtx<C>(
      context: React.Context<C>,
      map: (context: C) => Record<string, any>
    ) {
      maps.push([context, map]);

      return this;
    },
    addMiddleware(m: Middleware) {
      middleware.push(m);

      return this;
    },
    component(): React.FC<JSX.IntrinsicElements[E]> {
      Object.freeze(maps);

      const useMappedContext = (props: Record<string, any>) => {
        for (const [ctx, mapper] of maps) {
          const context = React.useContext(ctx);

          Object.assign(props, mapper(context));
        }

        return props;
      };

      let c = React.memo(
        React.forwardRef<any, React.PropsWithChildren>(
          ({ children, ...props }, ref): JSX.Element => {
            const mappedProps = useMappedContext(props);
            mappedProps.ref = ref;

            return React.createElement(v, mappedProps, children);
          }
        )
      ) as any;

      for (const m of middleware) {
        c = m(c);
      }

      return c;
    },
  };
};
