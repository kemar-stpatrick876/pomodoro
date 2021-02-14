import { IPomodoroTime } from '../settings/settings/settings.model';

export enum pomodoroMode {
  pomodoro = 'pomodoro',
  shortBreak = 'shortBreak',
  longBreak = 'longBreak',
}
export interface IPomodoroPhase {
  name: pomodoroMode;
  duration: number;
  completedInActiveSession: number;
  completedTotal: number;
}
export class Pomodoro {
  private readonly pomodoroPhasePerSession = 4;
  public phases!: {
    [pomodoroMode.pomodoro]: IPomodoroPhase;
    [pomodoroMode.shortBreak]: IPomodoroPhase;
    [pomodoroMode.longBreak]: IPomodoroPhase;
  };
  private currentPhase: pomodoroMode = pomodoroMode.pomodoro;
  public sessionCount = 0;

  constructor(pomodoroTime: IPomodoroTime) {
    const { pomodoro, shortBreak, longBreak } = pomodoroTime;

    const pomodoroPhase: IPomodoroPhase = {
      name: pomodoroMode.pomodoro,
      duration: pomodoro,
      completedInActiveSession: 0,
      completedTotal: 0
    };

    const shortBreakPhase: IPomodoroPhase = {
      name: pomodoroMode.shortBreak,
      duration: shortBreak,
      completedInActiveSession: 0,
      completedTotal: 0
    };

    const longBreakPhase: IPomodoroPhase = {
      name: pomodoroMode.longBreak,
      duration: longBreak,
      completedInActiveSession: 0,
      completedTotal: 0
    };

    this.phases = {
      [pomodoroMode.pomodoro]: pomodoroPhase,
      [pomodoroMode.shortBreak]: shortBreakPhase,
      [pomodoroMode.longBreak]: longBreakPhase,
    };
  }

  public nextPhase(): IPomodoroPhase {
    this.getCurrentPhase().completedTotal++;
    if (this.getCurrentPhase().name === pomodoroMode.pomodoro) {
      this.getCurrentPhase().completedInActiveSession++;
      if (this.getCurrentPhase().completedInActiveSession === this.pomodoroPhasePerSession) {
        this.currentPhase = pomodoroMode.longBreak;
        return this.getCurrentPhase();
      } else {
        this.currentPhase = pomodoroMode.shortBreak;
        return this.getCurrentPhase();
      }
    } else {
      if (this.getCurrentPhase().name === pomodoroMode.longBreak) {
        this._nextSession();
      }
      this.currentPhase = pomodoroMode.pomodoro;
      return this.getCurrentPhase();
    }
  }
  private _nextSession(): void {
    this.sessionCount++;
    this.phases[pomodoroMode.pomodoro].completedInActiveSession = 0;
    this.phases[pomodoroMode.shortBreak].completedInActiveSession = 0;
    this.phases[pomodoroMode.longBreak].completedInActiveSession = 0;
  }

  public getCurrentPhase(): IPomodoroPhase {
    return this.phases[this.currentPhase];
  }
}
