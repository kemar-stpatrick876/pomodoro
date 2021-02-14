import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { SettingsLauncherDirective } from './settings/settings-launcher.directive';

@Component({
  selector: 'pomodoro-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  @ViewChild(SettingsLauncherDirective)
  settingsLauncher!: SettingsLauncherDirective;

  ngAfterViewInit(): void {
    this.settingsLauncher.launchSettingsOverlay(true);
  }
}
