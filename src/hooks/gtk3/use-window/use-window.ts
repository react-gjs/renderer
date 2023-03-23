import React from "react";
import { WindowContext } from "../../../components/window/window";

export const useWindow = () => {
  const windowElem = React.useContext(WindowContext);

  return windowElem;
};
