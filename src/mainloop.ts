export class MainLoop {
  static loopName?: string;

  static {
    const g = globalThis as any as { MAIN_LOOP_NAME?: string };

    if (g.MAIN_LOOP_NAME) {
      this.loopName = g.MAIN_LOOP_NAME;
    }
  }

  static start() {
    imports.mainloop.run(this.loopName ?? "main");
  }

  static quit() {
    if (!this.loopName) {
      const m: typeof imports.mainloop & { _mainLoops: Record<string, any> } =
        imports.mainloop as any;

      if ("main" in m._mainLoops) {
        imports.mainloop.quit("main");
      }

      const firstLoopName = Object.keys(m._mainLoops)[0];

      if (firstLoopName) {
        imports.mainloop.quit(firstLoopName);
      }
    } else {
      imports.mainloop.quit(this.loopName);
    }
  }
}
