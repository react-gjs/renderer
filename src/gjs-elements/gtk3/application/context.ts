import React from "react";
import type { ApplicationElement } from "./application";

export type ApplicationContext = {
  /**
   * Dismantles the React Tree, effectively unmounting all components
   * and then exits the application.
   */
  quit(): void;
  applicationId: string;
};

const ApplicationContext = React.createContext<ApplicationContext>({
  quit() {},
  applicationId: "",
});

export const ApplicationContextProvider = (
  props: React.PropsWithChildren<{ application: ApplicationElement }>,
) => {
  const [shouldDismantle, setShouldDismantle] = React.useState(false);

  const [context] = React.useState(() => {
    const context: ApplicationContext = {
      applicationId: props.application.get_application_id()!,
      quit() {
        /**
         * We do not exit the app immediately, first we wait fo the
         * next React render cycle to complete (since that guarantees
         * that all components are unmounted), and then the app is
         * exited (see useEffect below)
         */
        setShouldDismantle(true);
      },
    };

    Object.assign(globalThis, {
      quitMainApplication: context.quit,
    });

    props.application.reactContext = context;

    return context;
  });

  React.useEffect(() => {
    if (shouldDismantle) {
      props.application.remove();
    }
  }, [shouldDismantle]);

  if (shouldDismantle) {
    return null;
  }

  return React.createElement(
    ApplicationContext.Provider,
    { value: context },
    props.children,
  );
};

export const useApp = (): ApplicationContext => {
  const context = React.useContext(ApplicationContext);

  return context;
};
