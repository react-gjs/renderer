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
      this.container = GjsReconciler.createContainer(
        this.application,
        1,
        null,
        false,
        null,
        "",
        () => console.error,
        null,
      );
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

    setTimeout(() => {
      const code = this.application.run(system.programArgs);
      system.exit(code);
    }, 0);

    imports.mainloop.run("Renderer.start");
  }
}
