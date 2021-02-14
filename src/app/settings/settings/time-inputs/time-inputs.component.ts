import { forwardRef, Output } from '@angular/core';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IPomodoroTime } from '../settings.model';



@Component({
  selector: 'pomodoro-time-inputs',
  templateUrl: './time-inputs.component.html',
  styleUrls: ['./time-inputs.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimeInputsComponent),
      multi: true,
    },
  ],
})
export class TimeInputsComponent implements ControlValueAccessor, OnInit {
  @Output()
  valueChange: EventEmitter<IPomodoroTime> = new EventEmitter<IPomodoroTime>();
  value: IPomodoroTime = {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
  };
  constructor() {}
  writeValue(value: IPomodoroTime): void {
    this.value = value;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  ngOnInit(): void {}

  onChange: any = () => {};
  onTouched: any = () => {};

  onInputChange(e: any): void {
    const {
      target: { name, value },
    } = e;
    switch (name) {
      case 'pomodoro':
        this.value.pomodoro = parseInt(value, 10);
        break;
      case 'shortBreak':
        this.value.shortBreak = parseInt(value, 10);
        break;
      case 'longBreak':
        this.value.longBreak = parseInt(value, 10);
        break;
    }

    this.onChange(this.value);
    this.valueChange.emit(this.value);
  }
}
