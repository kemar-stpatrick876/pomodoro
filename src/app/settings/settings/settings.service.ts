import { SelectionModel } from '@angular/cdk/collections';
import { Injectable } from '@angular/core';
import { IPomodoroTime, Settings } from './settings.model';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SettingsService extends SelectionModel<Settings> {
  private readonly timeSettingsChanged: Subject<IPomodoroTime> = new Subject();
  public readonly onTimeSettingsChanged: Observable<IPomodoroTime> = this.timeSettingsChanged.asObservable();
  private readonly LOCAL_STORAGE_KEY = 'Pomodoro_Settings';
  constructor() {
    super(false, [], false);
    this._initSetting();
  }

  private _initSetting(): void {
    const foundInStorage = localStorage.getItem(this.LOCAL_STORAGE_KEY);
    if (foundInStorage) {
      super.select(JSON.parse(foundInStorage) as Settings);
      return;
    }
    super.select(new Settings());
  }

  public selectColor(color: string): void {
    const settings: Settings = super.selected[0];
    settings.color = color;
    super.select(settings);
    localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(settings));
  }

  public selectFont(font: string): void {
    const settings: Settings = super.selected[0];
    settings.font = font;
    super.select(settings);
    localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(settings));
  }

  public selectTime(time: IPomodoroTime): void {
    const settings: Settings = super.selected[0];
    settings.time = time;
    super.select(settings);
    localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(settings));
    this.timeSettingsChanged.next(super.selected[0].time);
  }

  public get selected(): Settings[] {
    const foundInStorage = localStorage.getItem(this.LOCAL_STORAGE_KEY);

    if (super.isEmpty() && foundInStorage) {
      super.select(JSON.parse(foundInStorage));
    }
    return super.selected;
  }
}
