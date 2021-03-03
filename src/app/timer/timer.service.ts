import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription, timer } from 'rxjs';
import { takeWhile, tap } from 'rxjs/operators';
import { Pomodoro } from './Pomodoro';

export enum timerState {
  notStarted,
  running,
  paused,
  stopped,
}

export interface ITimerChange {
  display: string;
  minutes: number;
  seconds: number;
  percentageRemaining: number;
}
@Injectable({
  providedIn: 'root',
})
export class TimerService {
  private timeElapsed = 0;
  private timer!: Observable<number> | null;
  private subscription!: Subscription;
  private durationInSeconds!: number;
  public change: Subject<ITimerChange> = new Subject<ITimerChange>();
  public state!: timerState;
  public pomodoro!: Pomodoro;
  percentageRemaining: number;

  constructor() {
    this.timeElapsed = 0;
  }

  public get isInProgress(): boolean {
    return (
      this.state === timerState.running || this.state === timerState.paused
    );
  }

  init(pomodoro: Pomodoro): void {
    this.pomodoro = pomodoro;
    const phase = pomodoro.getCurrentPhase();
    this.state = timerState.notStarted;
    this.durationInSeconds = phase.duration * 60;

    this.change.next({
      display: `${phase.duration}:00`,
      minutes: phase.duration,
      seconds: 0,
      percentageRemaining: 0,
    });
  }

  start(): void {
    let secondCounter = 0;
    if (!this.percentageRemaining) {
      this.percentageRemaining = 100;
    }
    let timeLimit = this.durationInSeconds;
    if (this.state === timerState.paused) {
      timeLimit = this.durationInSeconds - this.timeElapsed;
      secondCounter = this.timeElapsed;
    }

    this.timer = timer(1000, 1000).pipe(
      takeWhile(() => secondCounter < timeLimit),
      tap(() => secondCounter++)
    );
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.subscription = this.timer.subscribe(() => {
      this.state = timerState.running;
      this.timeElapsed = secondCounter;
      const timeRemaining = this.durationInSeconds - this.timeElapsed;
      const minutes = Math.floor(timeRemaining / 60);
      const seconds = timeRemaining - minutes * 60;
      const display = `${('0' + minutes.toString()).slice(-2)}:${(
        '0' + seconds.toString()
      ).slice(-2)}`;
      if (secondCounter % 60 === 0) {
        this.percentageRemaining  = (timeRemaining / this.durationInSeconds) * 100;
      }

      this.change.next({
        display,
        minutes,
        seconds,
        percentageRemaining: this.percentageRemaining
      });
      if (this.percentageRemaining  === 0) {
        this.pomodoro.nextPhase();
        this.durationInSeconds = this.pomodoro.getCurrentPhase().duration * 60;
        this.subscription.unsubscribe();
        this.timer = null;
        this.start();
      }
    });
  }

  stop(): void {
    if (this.timer) {
      this.subscription.unsubscribe();
      this.timer = null;
      this.state = timerState.stopped;
      this.percentageRemaining = undefined;
    }
  }

  pause(): void {
    if (this.timer) {
      this.subscription.unsubscribe();
      this.timer = null;
      this.state = timerState.paused;
    }
  }
}
