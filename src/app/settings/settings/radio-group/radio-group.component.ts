import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  radioGroupType,
  IRadioGroupOption,
  IRadioGroupChangeEvent,
} from '../settings.model';

@Component({
  selector: 'pomodoro-radio-group',
  templateUrl: './radio-group.component.html',
  styleUrls: ['./radio-group.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioGroupComponent),
      multi: true,
    },
  ],
})
export class RadioGroupComponent implements ControlValueAccessor, OnInit {
  constructor() {}
  @Input() type!: radioGroupType;
  @Input() options: IRadioGroupOption[] = [];
  @Output()
  valueChange: EventEmitter<IRadioGroupChangeEvent> = new EventEmitter<IRadioGroupChangeEvent>();
  public readonly radioGroupType = radioGroupType;
  disabled = false;
  selected!: IRadioGroupOption;

  writeValue(option: IRadioGroupOption): void {
    this.selected = option;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public isCheckedOption(option: IRadioGroupOption): boolean {
    return this.selected && this.selected.value === option.value;
  }

  ngOnInit(): void {
    const initialSelected = this.options.filter(
      (option: IRadioGroupOption) => option.checked
    )[0];
    if (initialSelected) {
      this.onSelectionChange(initialSelected);
    }
  }

  onChange: any = () => {};
  onTouched: any = () => {};

  onSelectionChange(selected: IRadioGroupOption): void {
    this.selected = selected;
    this.onChange(this.selected);
    this.valueChange.emit({
      type: this.type,
      selected: this.selected
    });
  }
}
