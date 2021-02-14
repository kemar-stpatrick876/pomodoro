import { SettingsLauncherDirective } from './settings-launcher.directive';
import { SpectatorDirective, createDirectiveFactory } from '@ngneat/spectator';
import { SettingsModule } from './settings.module';
describe('SettingsLauncherDirective', () => {
  let spectator: SpectatorDirective<SettingsLauncherDirective>;
  const createDirective = createDirectiveFactory({
    directive: SettingsLauncherDirective,
    imports: [SettingsModule]
  });
  beforeEach(() => {
    spectator = createDirective(`<button id="testButton" pomodoroSettingsLauncher></button>`);
  });

  it('should launch settings overlay', () => {
    const launchSettingsOverlaySpy = spyOn(spectator.directive, 'launchSettingsOverlay').and.callThrough();
    spectator.click(spectator.query('#testButton') as Element);
    expect(launchSettingsOverlaySpy).toHaveBeenCalled();
    expect(document.querySelector('pomodoro-settings')).toBeVisible();
  });
});
