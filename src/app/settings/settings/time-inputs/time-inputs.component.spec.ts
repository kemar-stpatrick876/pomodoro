import { Spectator, createHostFactory } from '@ngneat/spectator';

import { TimeInputsComponent } from './time-inputs.component';

describe('TimeInputsComponent', () => {
  let spectator: Spectator<TimeInputsComponent>;
  const createHost = createHostFactory(TimeInputsComponent);

  it('should load time inputs', () => {
    spectator = createHost(
      `   <pomodoro-time-inputs formControlName="time"></pomodoro-time-inputs>`
    );

    spectator.component.value =  {
      pomodoro: 35,
      shortBreak: 10,
      longBreak: 25,
    };

    spectator.detectChanges();
    expect(spectator.query('.pomodoro-time-input--pomodoro')).toHaveValue('35');
    expect(spectator.query('.pomodoro-time-input--short-break')).toHaveValue('10');
    expect(spectator.query('.pomodoro-time-input--long-break')).toHaveValue('25');

  });
});
