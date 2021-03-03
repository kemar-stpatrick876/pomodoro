import { AfterViewInit, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ResponsiveService } from '../responsive.service';
import { IPomodoroTime } from '../settings/settings/settings.model';
import { SettingsService } from '../settings/settings/settings.service';
import { Pomodoro } from './Pomodoro';
import { ITimerChange, TimerService, timerState } from './timer.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'pomodoro-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
})
export class TimerComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('progressCircle') progressCircle!: ElementRef<SVGCircleElement>;
  public strokeDashArray!: string;
  public strokeDashOffset!: string;
  public readonly timerState = timerState;
  public timerVisible = true;
  timerChangeSub: Subscription;
  constructor(
    private settingsService: SettingsService,
    public timerService: TimerService,
    private renderer: Renderer2,
    private responsiveService: ResponsiveService
  ) {}

  ngOnDestroy(): void {
    if (this.timerChangeSub) {
      this.timerChangeSub.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.settingsService.onTimeSettingsChanged.subscribe(
      (timeSetting: IPomodoroTime) => {
        this.timerService.init(new Pomodoro(timeSetting));
      }
    );
    this.responsiveService.watchForBreakpointChanges().subscribe(() => {
      // Force re-rendering of svg on breakpoint change
      if (!this.progressCircle) {
        return;
      }
      this.timerVisible = false;
      setTimeout(() => {
        this.timerVisible = true;
      }, 500);
    });

  }

  ngAfterViewInit(): void {
    this.styleProgressSvg();
  }

  private styleProgressSvg(): void {
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

    if (this.timerChangeSub) {
      this.timerChangeSub.unsubscribe();
    }
    this.timerChangeSub = this.timerService.change.subscribe((timeChange: ITimerChange) => {
      const { percentageRemaining: percentageElapsed } = timeChange;
      const offset =
        circumference - (percentageElapsed / 100) * circumference;
      this.renderer.setStyle(nativeElement, 'strokeDashoffset', `${offset}`);
    });
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
    return cls;
  }

  public get fontClass(): string {
    let fontClass = '';
    const [currentSelection = { font: '' }] = this.settingsService.selected;
    const { font } = currentSelection;
    fontClass += font;

    return fontClass + ' ';
  }

  public get progressDims(): {
    r: number;
    cxY: number;
  } {
    let r = 130;
    let cxY = 150;
    if (!this.responsiveService.isMobileScreen) {
      r = 180;
      cxY = 200;
    }

    return {
      r,
      cxY
    };
  }

  public startTime(): void {
    if (this.timerService.state === timerState.running) {
      this.timerService.pause();
    } else {
      this.timerService.start();
    }
  }
}
