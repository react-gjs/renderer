/**
 * Merges two objects deeply.
 */
export const mergeObjects = <T extends object>(a: T, b: T) => {
  const result = { ...a };
  for (const key in b) {
    if (
      typeof b[key] === "object" &&
      b[key] != null &&
      !Array.isArray(b[key]) &&
      typeof result[key] === "object" &&
      result[key] != null &&
      !Array.isArray(result[key])
    ) {
      // @ts-ignore
      result[key] = mergeObjects(result[key], b[key]);
    } else {
      result[key] = b[key];
    }
  }
  return result;
};
