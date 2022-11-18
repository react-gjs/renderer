import type GLib from "gi://GLib";

export const getGLibListIterable = <T>(
  list: GLib.List,
  reverse = false
): Iterable<T> => {
  if (reverse) {
    while (list.next) {
      list = list.next;
    }

    function* iterator() {
      let current = list;
      while (current) {
        yield current.data as T;
        current = current.prev;
      }
    }

    return iterator();
  }

  function* iterator() {
    let current = list;
    while (current) {
      yield current.data as T;
      current = current.next;
    }
  }

  return iterator();
};
