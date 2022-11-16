import type { DiffedProps } from "../gjs-elements/utils/map-properties";
import { UnsetProp } from "../gjs-elements/utils/map-properties";

const compareMargins = (oldArray: any[], newArray: any[]) => {
  if (typeof oldArray !== typeof newArray) {
    return true;
  }

  if (oldArray.length !== newArray.length) {
    return true;
  }

  for (let i = 0; i < oldArray.length; i++) {
    if (oldArray[i] !== newArray[i]) {
      return true;
    }
  }

  return false;
};

export const diffProps = (oldProps: any, newProps: any, gjsElem: boolean) => {
  const diffedProps: DiffedProps = [];

  const oldPropsKeys = Object.keys(oldProps);
  const newPropsKeys = Object.keys(newProps);

  for (let i = 0; i < newPropsKeys.length; i++) {
    const key = newPropsKeys[i];

    if (gjsElem && key === "margin") {
      if (compareMargins(oldProps[key], newProps[key])) {
        diffedProps.push([key, newProps[key]]);
      }
      continue;
      // we don't want to compare margins by reference, since
      // those can be tuples of numbers, and even if margin values
      // did not change, the tuple reference will be different
    }

    if (newProps[key] !== oldProps[key]) {
      diffedProps.push([key, newProps[key]]);
    }
  }

  for (let i = 0; i < oldPropsKeys.length; i++) {
    const key = oldPropsKeys[i];

    if (!(key in newProps)) {
      diffedProps.push([key, UnsetProp]);
    }
  }

  return diffedProps;
};
