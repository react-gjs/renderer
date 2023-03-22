export class Dispatcher {
  private nextDispatch?: () => void;
  private timeoutID?: number;

  constructor(private timeout: number) {}

  dispatch(fn: () => void) {
    this.cancelPreviousDispatch();

    this.nextDispatch = fn;

    this.timeoutID = setTimeout(() => {
      const nextDispatch = this.nextDispatch;
      if (nextDispatch) {
        this.nextDispatch = undefined;
        setTimeout(() => nextDispatch(), 0);
      }
    }, this.timeout);
  }

  cancelPreviousDispatch() {
    if (this.timeoutID) {
      clearTimeout(this.timeoutID);
      this.timeoutID = undefined;
      this.nextDispatch = undefined;
    }
  }
}
