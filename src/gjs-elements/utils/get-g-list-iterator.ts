import type GLib from "gi://GLib";

export const getGLibListIterable = <T>(list: GLib.List): Iterable<T> => {
  function* iterator() {
    let current = list;
    while (current) {
      yield current.data as T;
      current = current.next;
    }
  }

  return iterator();
};
