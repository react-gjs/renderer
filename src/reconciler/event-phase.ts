import {
  ContinuousEventPriority,
  DefaultEventPriority,
  DiscreteEventPriority,
} from "react-reconciler/constants";

export enum EventPhase {
  /**
   * The default event phase. Used anytime when the event phase is not
   * a `Input` or `Action` phase.
   */
  Default = DefaultEventPriority,
  /**
   * The input event phase. Indicates that the current event is caused
   * by user input. (e.g. a button click or a keyboard key press)
   */
  Input = DiscreteEventPriority,
  /**
   * The action event phase. Indicates that the current event is
   * caused by an user action, that is not a regular input. (e.g. a
   * button click or a keyboard key press)
   */
  Action = ContinuousEventPriority,
}

export class EventPhaseController {
  private static currentPhase: EventPhase = EventPhase.Default;

  static getCurrentPhase(): EventPhase {
    return this.currentPhase;
  }

  static startPhase<R>(phase: EventPhase, callback: () => R) {
    const previousPhase = this.currentPhase;
    this.currentPhase = phase;
    try {
      return callback();
    } finally {
      this.currentPhase = previousPhase;
    }
  }
}
