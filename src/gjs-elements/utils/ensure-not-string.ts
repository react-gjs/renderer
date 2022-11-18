export function ensureNotString<T>(value: T | string): asserts value is T {
  if (typeof value === "string") {
    throw new Error("This element can't have strings as it's children.");
  }
}
