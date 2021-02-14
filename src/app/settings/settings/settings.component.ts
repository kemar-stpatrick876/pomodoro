import { Component, Input, OnInit } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';
import {
  radioGroupType,
  IRadioGroupOption,
  IPomodoroTime,
} from './settings.model';
import { SettingsService } from './settings.service';
import { FormControl, FormGroup } from '@angular/forms';
import { TimerService } from 'src/app/timer/timer.service';
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';

@Component({
  selector: 'pomodoro-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  @Input() initialAppLoad = false;
  public readonly radioGroupType = radioGroupType;
  public readonly fontOptions: IRadioGroupOption[] = [
    {
      label: 'Aa',
      name: 'lexend',
      value: 'font_setting_1',
      checked: true,
    },
    {
      label: 'Aa',
      name: 'roboto',
      value: 'font_setting_2',
      checked: false,
    },
    {
      label: 'Aa',
      name: 'noto-sans-jp',
      value: 'font_setting_3',
      checked: false,
    },
  ];
  public readonly colorOptions: IRadioGroupOption[] = [
    {
      name: 'red',
      value: 'color_setting_1',
      checked: false,
    },
    {
      name: 'blue',
      value: 'color_setting_2',
      checked: true,
    },
    {
      name: 'green',
      value: 'color_setting_3',
      checked: false,
    },
  ];

  settingsForm!: FormGroup;

  constructor(
    private readonly overlayRef: OverlayRef,
    public settingsService: SettingsService,
    public timerService: TimerService
  ) {}

  ngOnInit(): void {
    this.settingsForm = this._createForm();
  }

  private _createForm(): FormGroup {
    const timeFormControl: FormControl = new FormControl({
      pomodoro: 25,
      shortBreak: 5,
      longBreak: 15,
    } as IPomodoroTime);

    const fontFormControl: FormControl = new FormControl(this.fontOptions[0]);
    const colorFormControl: FormControl = new FormControl(this.colorOptions[0]);

    const [currentSelection] = this.settingsService.selected || [];
    if (currentSelection) {
      const { font, color, time } = cloneDeep(currentSelection);

      if (time) {
        timeFormControl.setValue(time);
      }
      if (font) {
        const fontOption = this.fontOptions.find(
          (option: IRadioGroupOption) => option.value === font
        );
        if (fontOption) {
          fontFormControl.setValue(fontOption);
        }
      }

      if (color) {
        const colorOption = this.colorOptions.find(
          (option: IRadioGroupOption) => option.value === color
        );
        if (colorOption) {
          colorFormControl.setValue(colorOption);
        }
      }
    }

    return new FormGroup({
      time: timeFormControl,
      font: fontFormControl,
      color: colorFormControl,
    });
  }

  public get timeChangingWhileTimeInProgress(): boolean {
    const [currentSelection = {color: '', font: '', time: {}}] = this.settingsService.selected || [];
    const { time: currentTime } = cloneDeep(currentSelection);
    const { value: time } = this.settingsForm.get('time') as FormControl;
    return this.timerService.isInProgress && !isEqual(currentTime, time);
  }

  public closePopup(shouldApply?: boolean): void {
    if (shouldApply) {
      this.onApply();
    } else {
      this.overlayRef.detach();
    }
  }

  public onApply(): void {
    const {
      color: { value: color },
      font: { value: font },
      time,
    } = this.settingsForm.value;
    if (this.timeChangingWhileTimeInProgress) {
      this.timerService.stop();
    }
    this.settingsService.selectColor(color);
    this.settingsService.selectFont(font);
    this.settingsService.selectTime(time);
    this.closePopup();
  }
}
