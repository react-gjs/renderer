import React from "react";
import system from "system";
import type { ApplicationOptions } from "../gjs-elements/gtk3/application/application";
import { ApplicationElement } from "../gjs-elements/gtk3/application/application";
import { ApplicationContextProvider } from "../gjs-elements/gtk3/application/context";
import { GjsReconciler } from "./gjs-renderer";

export class Renderer {
  protected readonly application;
  protected container: any;

  constructor(protected readonly options: ApplicationOptions) {
    this.application = new ApplicationElement(options);
  }

  protected getContainer() {
    if (!this.container) {
      const container = GjsReconciler.createContainer(
        this.application,
        1,
        null,
        false,
        null,
        "",
        (...args: any[]) => console.error(...args),
        (...args: any[]) => console.error(...args),
        // @ts-expect-error
        (...args: any[]) => console.error(...args),
        null,
      );
      this.container = container;
    }
    return this.container;
  }

  public start(rootElement: JSX.Element) {
    const container = this.getContainer();

    GjsReconciler.updateContainer(
      React.createElement(
        ApplicationContextProvider,
        { application: this.application },
        rootElement,
      ),
      container,
      null,
      () => {},
    );

    this.application
      .runAsync(system.programArgs)
      .then((code) => {
        system.exit(code);
      })
      .catch((e) => {
        console.error(e);
        system.exit(1);
      });
  }
}
