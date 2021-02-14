
export const FONT_OPTION_MAP: Map<string, {'class': string; value: string; }> = new Map();
export const COLOR_OPTION_MAP: Map<string, {'class': string; value: string; }> = new Map();


export interface IPomodoroTime {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
}

export enum radioGroupType {
  font = 'font',
  color = 'color'
}
export interface IRadioGroupOption {
  label?: string;
  value: string;
  name: string;
  checked: boolean;
}
export interface IRadioGroupChangeEvent {
  type: radioGroupType;
  selected: IRadioGroupOption;
}

export class Settings {
  private COLOR!: string;
  private FONT!: string;
  private TIME!: IPomodoroTime;


  public get color(): string {
    return this.COLOR;
  }

  public set color(v: string) {
    this.COLOR = v;
  }

  public get font(): string {
    return this.FONT;
  }

  public set font(v: string) {
    this.FONT = v;
  }

  public get time(): IPomodoroTime {
    return this.TIME;
  }

  public set time(v: IPomodoroTime) {
    this.TIME = v;
  }

}
