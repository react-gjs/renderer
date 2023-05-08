import type { ApplicationContext } from "./gjs-elements/gtk3/application/context";
import type { ApplicationCss } from "./global-css";
export default {};

declare global {
  /**
   * Globally accessible equivalent of the `quit()` method that's
   * available through `useApp` hook.
   *
   * If possible, please use the `useApp` hook instead.
   */
  const quitMainApplication: undefined | ApplicationContext["quit"];

  const applicationCss: ApplicationCss;
}
