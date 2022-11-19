export class OrderedMap<A, B> {
  private map = new Map<A, B>();
  private list: Array<A> = [];

  get(key: A) {
    return this.map.get(key);
  }

  set(key: A, value: B) {
    this.map.set(key, value);
    this.list.push(key);
  }

  delete(key: A) {
    this.map.delete(key);
    this.list = this.list.filter((k) => k !== key);
  }

  clear() {
    this.map.clear();
    this.list = [];
  }

  forEach(callback: (value: B, key: A, index: number) => void) {
    this.list.forEach((key, index) => {
      callback(this.map.get(key)!, key, index);
    });
  }

  get length() {
    return this.list.length;
  }

  keys() {
    return this.list.slice();
  }

  values() {
    return this.list.map((key) => this.map.get(key)!);
  }

  entries() {
    return this.list.map((key) => [key, this.map.get(key)!] as const);
  }

  [Symbol.iterator]() {
    return this.entries();
  }
}
