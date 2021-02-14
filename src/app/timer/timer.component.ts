import { AfterViewInit, ElementRef, Renderer2 } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IPomodoroTime } from '../settings/settings/settings.model';
import { SettingsService } from '../settings/settings/settings.service';
import { Pomodoro } from './Pomodoro';
import { ITimerChange, TimerService, timerState } from './timer.service';

@Component({
  selector: 'pomodoro-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
})
export class TimerComponent implements OnInit, AfterViewInit {
  @ViewChild('progressCircle') progressCircle!: ElementRef<SVGCircleElement>;
  public strokeDashArray!: string;
  public strokeDashOffset!: string;
  public readonly timerState = timerState;
  constructor(
    private settingsService: SettingsService,
    public timerService: TimerService,
    private renderer: Renderer2,
  ) {}

  ngOnInit(): void {
    this.settingsService.onTimeSettingsChanged.subscribe((timeSetting: IPomodoroTime) => {
      this.timerService.init(new Pomodoro(timeSetting));
    });
  }



  ngAfterViewInit(): void {
    setTimeout(() => {
      const { nativeElement } = this.progressCircle;
      const radius = this.progressCircle.nativeElement.r.baseVal.value;
      const circumference = radius * 2 * Math.PI;
      this.renderer.setStyle(
        nativeElement,
        'strokeDasharray',
        `${circumference} ${circumference}`
      );
      this.renderer.setStyle(
        nativeElement,
        'strokeDashoffset',
        `${circumference}`
      );

      this.timerService.change.subscribe((timeChange: ITimerChange) => {
        const { percentageRemaining: percentageElapsed } = timeChange;
        const offset =
          circumference - (percentageElapsed / 100) * circumference;
        this.renderer.setStyle(nativeElement, 'strokeDashoffset', `${offset}`);
      });
    }, 10);
  }


  public get buttonText(): string {
    let text = 'START';

    if (this.timerService.state === timerState.running) {
      text = 'PAUSE';
    } else if (this.timerService.state === timerState.paused) {
      text = 'RESUME';
    }
    return text;
  }


  public getColorClass(type: 'fill' | 'stroke'): string {
    const [currentSelection = { color: '' }] = this.settingsService.selected;
    const { color } = currentSelection;
    const cls = color + (type === 'fill' ? '--fill ' : '--stroke ');
    return cls ;
  }

  public get fontClass(): string {
    let fontClass = '';
    const [currentSelection = { font: '' }] = this.settingsService.selected;
    const { font } = currentSelection;
    fontClass += font;

    return fontClass + ' ';
  }

  public startTime(): void {
    if (this.timerService.state === timerState.running) {
      this.timerService.pause();
    } else {
      this.timerService.start();
    }
  }
}
