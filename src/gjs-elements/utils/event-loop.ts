export class EventLoop {
  private events: Array<(done: () => void) => void> = [];
  private isProcessing = false;

  addEvent(event: (done: () => void) => void) {
    this.events.push(event);
    this.processEvents();
  }

  async processEvents() {
    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    while (this.events.length > 0) {
      const event = this.events.shift();
      if (event) {
        await new Promise<void>((resolve) => {
          event(resolve);
        });
      }
    }

    this.isProcessing = false;

    if (this.events.length > 0) {
      this.processEvents();
    }
  }
}
