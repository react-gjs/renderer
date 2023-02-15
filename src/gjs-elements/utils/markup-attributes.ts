export class MarkupAttributes {
  private attributes = new Map<string, string>();

  set(key: string, value: string): MarkupAttributes {
    this.attributes.set(key, value);
    return this;
  }

  delete(key: string): MarkupAttributes {
    this.attributes.delete(key);
    return this;
  }

  stringify(): string {
    let result = "";

    for (const [key, value] of this.attributes) {
      result += ` ${key}="${value}"`;
    }

    return result;
  }

  /** Returns a copy of this object. */
  copy(): MarkupAttributes {
    const result = new MarkupAttributes();
    result.attributes = new Map(this.attributes);

    return result;
  }

  /**
   * Assigns the attributes of the given `MarkupAttributes` to this
   * object.
   */
  assign(other: MarkupAttributes): MarkupAttributes {
    for (const [key, value] of other.attributes) {
      this.attributes.set(key, value);
    }

    return this;
  }

  /**
   * Returns a new `MarkupAttributes` object that is a merge of `this`
   * object and the given `MarkupAttributes`.
   *
   * The given `MarkupAttributes` will take precedence over `this`
   * object.
   */
  merge(other: MarkupAttributes): MarkupAttributes {
    const result = this.copy();
    return result.assign(other);
  }
}
