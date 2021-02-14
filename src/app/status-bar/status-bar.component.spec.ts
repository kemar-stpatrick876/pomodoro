import { StatusBarComponent } from './status-bar.component';
import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { Pomodoro, pomodoroMode } from '../timer/Pomodoro';
import { TimerService } from '../timer/timer.service';
import { SettingsService } from '../settings/settings/settings.service';

describe('StatusBarComponent', () => {
  let spectator: Spectator<StatusBarComponent>;
  const createComponent = createComponentFactory({
    component: StatusBarComponent,
    imports: [],
    mocks: [TimerService],
    declareComponent: false,
  });
  const pomodoroStatusItem = () =>
    spectator.query(`.pomodoro-status-bar__item--${pomodoroMode.pomodoro}`);
  const shortBreakStatusItem = () =>
    spectator.query(`.pomodoro-status-bar__item--${pomodoroMode.shortBreak}`);
  const longBreakStatusItem = () =>
    spectator.query(`.pomodoro-status-bar__item--${pomodoroMode.longBreak}`);
  const activeItem = () =>
    spectator.query('.pomodoro-status-bar__item--active');

  beforeEach(() => (spectator = createComponent()));

  it('should not have a active class by default class by default', () => {
    expect(pomodoroStatusItem()).not.toHaveClass(
      'pomodoro-status-bar__item--active'
    );
    expect(shortBreakStatusItem()).not.toHaveClass(
      'pomodoro-status-bar__item--active'
    );
    expect(longBreakStatusItem()).not.toHaveClass(
      'pomodoro-status-bar__item--active'
    );
  });

  it('should show pomodoro phase as active in pomodoro session', () => {
    const timerService = spectator.inject(TimerService);
    timerService.pomodoro = new Pomodoro({
      pomodoro: 25,
      shortBreak: 5,
      longBreak: 25,
    });
    spectator.detectChanges();
    expect(pomodoroStatusItem()).toHaveClass(
      'pomodoro-status-bar__item--active'
    );
    expect(shortBreakStatusItem()).not.toHaveClass(
      'pomodoro-status-bar__item--active'
    );
    expect(longBreakStatusItem()).not.toHaveClass(
      'pomodoro-status-bar__item--active'
    );
  });

  it('should show shortBreak phase as active in pomodoro session', () => {
    const timerService = spectator.inject(TimerService);
    timerService.pomodoro = new Pomodoro({
      pomodoro: 25,
      shortBreak: 5,
      longBreak: 25,
    });
    timerService.pomodoro.nextPhase();
    spectator.detectChanges();
    expect(pomodoroStatusItem()).not.toHaveClass(
      'pomodoro-status-bar__item--active'
    );
    expect(shortBreakStatusItem()).toHaveClass(
      'pomodoro-status-bar__item--active'
    );
    expect(longBreakStatusItem()).not.toHaveClass(
      'pomodoro-status-bar__item--active'
    );
  });

  it('should show longBreak phase as active in pomodoro session', () => {
    const timerService = spectator.inject(TimerService);
    timerService.pomodoro = new Pomodoro({
      pomodoro: 25,
      shortBreak: 5,
      longBreak: 25,
    });
    timerService.pomodoro.nextPhase();
    timerService.pomodoro.nextPhase();
    timerService.pomodoro.nextPhase();
    timerService.pomodoro.nextPhase();
    timerService.pomodoro.nextPhase();
    timerService.pomodoro.nextPhase();
    timerService.pomodoro.nextPhase();

    spectator.detectChanges();
    expect(pomodoroStatusItem()).not.toHaveClass(
      'pomodoro-status-bar__item--active'
    );
    expect(shortBreakStatusItem()).not.toHaveClass(
      'pomodoro-status-bar__item--active'
    );
    expect(longBreakStatusItem()).toHaveClass(
      'pomodoro-status-bar__item--active'
    );
  });

  it('should be styled using font setting', () => {
    const settingsService = spectator.inject(SettingsService);
    settingsService.selectFont('font_setting_1');
    spectator.detectChanges();
    expect(pomodoroStatusItem()).toHaveStyle({
      fontFamily: '"Lexend Mega", sans-serif',
    });

    settingsService.selectFont('font_setting_2');
    spectator.detectChanges();
    expect(pomodoroStatusItem()).toHaveStyle({
      fontFamily: '"Noto Sans JP", sans-serif',
    });
  });

  it('should be styled using color setting', () => {
    const timerService = spectator.inject(TimerService);
    const settingsService = spectator.inject(SettingsService);
    timerService.pomodoro = new Pomodoro({
      pomodoro: 25,
      shortBreak: 5,
      longBreak: 25,
    });
    settingsService.selectColor('color_setting_1');
    spectator.detectChanges();
    expect(activeItem()).toHaveStyle({
      backgroundColor: '#dd1155',
    });

    settingsService.selectColor('color_setting_3');
    spectator.detectChanges();
    expect(activeItem()).toHaveStyle({
      backgroundColor: '#00cc99',
    });
  });

  it('should return item css classes', () => {
    const timerService = spectator.inject(TimerService);
    const settingsService = spectator.inject(SettingsService);
    timerService.pomodoro = new Pomodoro({
      pomodoro: 25,
      shortBreak: 5,
      longBreak: 25,
    });

    settingsService.selectColor('color_setting_1');
    settingsService.selectFont('font_setting_2');

    expect(spectator.component.getItemCssClass(pomodoroMode.pomodoro)).toBe(
      'pomodoro-status-bar__item--pomodoro font_setting_2 pomodoro-status-bar__item--active color_setting_1'
    );
    expect(spectator.component.getItemCssClass(pomodoroMode.shortBreak)).toBe(
      'pomodoro-status-bar__item--shortBreak font_setting_2'
    );
    expect(spectator.component.getItemCssClass(pomodoroMode.longBreak)).toBe(
      'pomodoro-status-bar__item--longBreak font_setting_2'
    );
  });
});
