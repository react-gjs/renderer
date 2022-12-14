export class HostContext<D extends Record<string, any>> {
  static init<D extends Record<string, any>>(initialData: D): HostContext<D> {
    const context = new HostContext();
    context.data = new Map(Object.entries(initialData));
    return context as HostContext<D>;
  }

  private parentContext?: HostContext<any>;
  private data!: Map<any, any>;

  private constructor() {}

  private isAnyEntryDifferent(data: Map<any, any>) {
    for (const [key, value] of data.entries()) {
      if (this.data.get(key) !== value) return true;
    }
    return false;
  }

  get<K extends keyof D>(key: K): D[K] | undefined {
    if (this.data.has(key)) return this.data.get(key) as D[K];
    else if (this.parentContext) return this.parentContext.get(key);
    return undefined;
  }

  set(nextData: Partial<D>): HostContext<D> {
    const newData = new Map(Object.entries(nextData));

    if (this.isAnyEntryDifferent(newData)) {
      const context = new HostContext();
      context.parentContext = this;
      context.data = newData;
      return context as HostContext<D>;
    }

    return this as any as HostContext<D>;
  }
}
