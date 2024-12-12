import {
  ContinuousEventPriority,
  DefaultEventPriority,
  DiscreteEventPriority,
  IdleEventPriority,
  // @ts-expect-error
  NoEventPriority,
} from "react-reconciler/constants";

export enum EventPriority {
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
  NoEvent = NoEventPriority,
  Idle = IdleEventPriority,
}

export class EventPhaseController {
  private static currentPriority: EventPriority = EventPriority.Default;
  private static onPhaseEnd?: () => void;

  static getPriority(): EventPriority {
    return this.currentPriority;
  }

  static setPriority(priority: EventPriority) {
    this.currentPriority = priority;
    this.onPhaseEnd = undefined;
  }

  static startPhase<R>(priority: EventPriority, callback: () => R) {
    const previousPriority = this.currentPriority;
    this.setPriority(priority);
    this.onPhaseEnd = () => {
      this.setPriority(previousPriority);
    };
    try {
      return callback();
    } finally {
      this.onPhaseEnd?.();
    }
  }
}
