import Gio from "gi://Gio";
import React from "react";
import system from "system";
import type { ApplicationOptions } from "../gjs-elements/gtk3/application/application";
import { ApplicationElement } from "../gjs-elements/gtk3/application/application";
import { ApplicationContextProvider } from "../gjs-elements/gtk3/application/context";
import { GjsRenderer } from "./gjs-renderer";

export const render = (
  appContent: JSX.Element,
  options: ApplicationOptions
) => {
  Object.assign(globalThis, {
    getApp: function () {
      return Gio.Application.get_default();
    },
  });

  const application = new ApplicationElement(options);

  const container = GjsRenderer.createContainer(
    application,
    1,
    null,
    false,
    null,
    "",
    () => console.error,
    null
  );

  GjsRenderer.updateContainer(
    React.createElement(
      ApplicationContextProvider,
      { application },
      appContent
    ),
    container,
    null,
    () => {}
  );

  setTimeout(() => {
    const code = application.run(system.programArgs);
    system.exit(code);
  }, 0);
};
