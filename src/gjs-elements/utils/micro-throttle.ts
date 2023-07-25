import { microtask } from "./micortask";

export const microThrottle = <A extends any[]>(
  callback: (...args: A) => void,
) => {
  let nextArgs: A | undefined;
  let isScheduledThisCycle = false;

  return (...args: A): void => {
    nextArgs = args;
    if (isScheduledThisCycle) {
      return;
    } else {
      isScheduledThisCycle = true;
      microtask(() => {
        isScheduledThisCycle = false;
        const args = nextArgs ?? ([] as any as A);
        nextArgs = undefined;
        callback(...args);
      });
    }
  };
};
