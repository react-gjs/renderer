import type { GjsInstances } from "../gjs-element-types";

export const removeChild = (
  parentInstance: GjsInstances,
  child: GjsInstances
) => {
  child.destroy();
};
