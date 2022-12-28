export class MAttributes {
  private readonly attributes = new Map<string, string>();

  set(key: string, value: string): void {
    this.attributes.set(key, value);
  }

  delete(key: string): void {
    this.attributes.delete(key);
  }

  stringify(): string {
    let result = "";

    for (const [key, value] of this.attributes) {
      result += ` ${key}="${value}"`;
    }

    return result;
  }
}
