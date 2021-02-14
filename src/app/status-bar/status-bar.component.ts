import { Component, Input, OnInit } from '@angular/core';
import { SettingsService } from '../settings/settings/settings.service';
import { pomodoroMode } from '../timer/Pomodoro';
import { TimerService } from '../timer/timer.service';

@Component({
  selector: 'pomodoro-status-bar',
  templateUrl: './status-bar.component.html',
  styleUrls: ['./status-bar.component.scss']
})
export class StatusBarComponent implements OnInit {

  pomodoroMode = pomodoroMode;
  constructor(private settingsService: SettingsService, private timerService: TimerService) { }

  ngOnInit(): void {
  }


  getItemCssClass(mode: pomodoroMode): string {
    let additionalCssClasses = `pomodoro-status-bar__item--${mode} `;
    const [currentSelection = {color: '', font: ''}] = this.settingsService.selected || [];
    const { color, font = '' } = currentSelection;

    additionalCssClasses += font;
    if (mode === (this.timerService.pomodoro && this.timerService.pomodoro.getCurrentPhase().name)) {
      additionalCssClasses += ' pomodoro-status-bar__item--active ' + color + '--bg';
    }
    // console.log('additionalCssClasses ', additionalCssClasses)
    return additionalCssClasses;
  }

}
