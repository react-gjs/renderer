// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import * as RT from "./rg-types";

declare global {
  namespace Rg {
    export import Element = RT;
  }
}
