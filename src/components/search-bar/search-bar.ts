import React from "react";
import type { SearchBarElement } from "../../gjs-elements/gtk3/search-bar/search-bar";
import { markAsIntrinsic } from "../../utils/intrinsic-marker";

export const SearchBarContext = React.createContext({
  searchBar: null as null | SearchBarElement,
});

export const SearchBar = React.forwardRef(
  (
    { children, ...props }: JSX.IntrinsicElements["SEARCH_BAR"],
    ref,
  ) => {
    const [elem, setElem] = React.useState<null | SearchBarElement>(
      null,
    );

    return React.createElement(
      SearchBarContext.Provider,
      {
        value: {
          searchBar: elem,
        },
      },
      React.createElement(
        "SEARCH_BAR",
        {
          ...props,
          ref,
          __rg_onMount: setElem,
        },
        elem ? children : null,
      ),
    );
  },
);

markAsIntrinsic(SearchBar, "SEARCH_BAR");
