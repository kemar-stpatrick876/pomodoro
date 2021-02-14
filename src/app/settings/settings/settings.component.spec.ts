import { OverlayRef } from '@angular/cdk/overlay';
import { Spectator, createHostFactory } from '@ngneat/spectator';
import { SettingsModule } from '../settings.module';
import { SettingsComponent } from './settings.component';
import { SettingsService } from './settings.service';
describe('SettingsComponent', () => {
  let spectator: Spectator<SettingsComponent>;
  const createHost = createHostFactory({
    component: SettingsComponent,
    declarations: [],
    mocks: [OverlayRef, SettingsService],
    imports: [SettingsModule]
  });

  it('should display settings form', () => {
    spectator = createHost(` <pomodoro-settings></pomodoro-settings>`);
    expect(spectator.query('pomodoro-time-inputs')).toBeVisible();
    expect(spectator.query('pomodoro-radio-group')).toBeVisible();
    expect(spectator.query('#applyButton')).toBeVisible();

  });

  it('should should apply settings', () => {
    spectator = createHost(` <pomodoro-settings></pomodoro-settings>`);
    const settingsService = spectator.inject(SettingsService);

    settingsService.selectColor.and.callFake(() => () => {});
    settingsService.selectFont.and.callFake(() => () => {});
    const closePopupSpy = spyOn(spectator.component, 'closePopup');

    const colorValue = spectator.component.settingsForm.get('color')?.value?.value;
    const fontValue = spectator.component.settingsForm.get('font')?.value?.value;

    spectator.click('#applyButton');

    expect(settingsService.selectColor).toHaveBeenCalledWith(colorValue);
    expect(settingsService.selectFont).toHaveBeenCalledWith(fontValue);
    expect(closePopupSpy).toHaveBeenCalled();
  });
});
