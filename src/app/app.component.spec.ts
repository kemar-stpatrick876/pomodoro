import { AppComponent } from './app.component';
import { Spectator, createHostFactory } from '@ngneat/spectator';
import { SettingsModule } from './settings/settings.module';
import { TimerComponent } from './timer/timer.component';
import { StatusBarComponent } from './status-bar/status-bar.component';
describe('AppComponent', () => {
  let spectator: Spectator<AppComponent>;
  const createHost = createHostFactory({
    component: AppComponent,
    declarations: [StatusBarComponent, TimerComponent],
    imports: [SettingsModule]
  });

  it('should launch and with settings modal open', () => {
    spectator = createHost(` <pomodoro-root></pomodoro-root>`);
    expect(document.querySelector('pomodoro-settings')).toBeVisible();
    expect(spectator.query('pomodoro-status-bar')).toBeVisible();
    expect(spectator.query('pomodoro-timer')).toBeVisible();
    expect(spectator.query('#settingsButton')).toBeVisible();
  });

  it('should launch settings modal', () => {
    spectator = createHost(` <pomodoro-root></pomodoro-root>`);
    expect(document.querySelector('pomodoro-settings')).toBeVisible();
    spectator.click(document.querySelector('pomodoro-settings .close-btn') as Element);
    expect(document.querySelector('pomodoro-settings')).not.toBeVisible();
    spectator.click(spectator.query('#settingsButton') as Element);
    expect(document.querySelector('pomodoro-settings')).toBeVisible();
  });

});
