import React from "react";
import type { WindowElement } from "../../gjs-elements/rg-types";

export const WindowContext =
  React.createContext<WindowElement | null>(null);

export const Window = React.forwardRef(
  ({ children, ...props }: JSX.IntrinsicElements["WINDOW"], ref) => {
    const [windowElem, setWindowElem] =
      React.useState<null | WindowElement>(null);

    return React.createElement(
      WindowContext.Provider,
      {
        value: windowElem,
      },
      React.createElement(
        "WINDOW",
        {
          ...props,
          ref,
          onWindowMounted: setWindowElem,
        },
        windowElem ? children : null,
      ),
    );
  },
);
