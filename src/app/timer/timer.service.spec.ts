import { fakeAsync, flush, tick } from '@angular/core/testing';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { Pomodoro } from './Pomodoro';

import { TimerService, timerState } from './timer.service';

describe('TimerService', () => {
  let spectator: SpectatorService<TimerService>;
  const createService = createServiceFactory(TimerService);

  beforeEach(() => (spectator = createService()));

  it('should not be in progress', () => {
    expect(spectator.service.isInProgress).toBeFalsy();
  });

  it('should initialize timer', () => {
    const pomodoro = new Pomodoro({
      pomodoro: 100,
      shortBreak: 5,
      longBreak: 25,
    });
    spectator.service.init(pomodoro);
    expect(spectator.service.pomodoro).toBe(pomodoro);
    expect(spectator.service.state).toBe(timerState.notStarted);
  });


  xit('should start timer', fakeAsync(() => {
    const pomodoro = new Pomodoro({
      pomodoro: 100,
      shortBreak: 5,
      longBreak: 25,
    });
    spectator.service.init(pomodoro);
    spectator.service.start();
    expect(spectator.service.state).toBe(timerState.running);
  }));

  xit('should pause timer', fakeAsync(() => {
   // TBD
  }));

  xit('should stop timer', fakeAsync(() => {
    // TBD
   }));
});
