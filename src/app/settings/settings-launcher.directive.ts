import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  Injector,
  Renderer2,
} from '@angular/core';
import { ResponsiveService } from '../responsive.service';
import { SettingsComponent } from './settings/settings.component';

@Directive({
  selector: '[pomodoroSettingsLauncher]',
})
export class SettingsLauncherDirective implements AfterViewInit {
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private overlay: Overlay,
    private parentInjector: Injector,
    private responsiveService: ResponsiveService

  ) {}

  ngAfterViewInit(): void {
    this.renderer.listen(this.el.nativeElement, 'click', () => {
      this.launchSettingsOverlay();
    });
  }

  public launchSettingsOverlay(initialAppLoad = false): void {
    const overlayRef = this.overlay.create(this._getOverlayConfig());
    const injector = Injector.create({
      parent: this.parentInjector,
      providers: [
        {
          provide: OverlayRef,
          useValue: overlayRef,
        },
      ],
    });
    const settingsPortal = new ComponentPortal(
      SettingsComponent,
      null,
      injector
    );
    const settingsComponentRef = overlayRef.attach(settingsPortal);
    settingsComponentRef.instance.initialAppLoad = initialAppLoad;
  }

  private _getOverlayConfig(): OverlayConfig {
    let width = 350;
    let height = 575;

    if (!this.responsiveService.isMobileScreen) {
      width = 540;
      height = 550;
    }
    const positionStrategy = this.overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically();
    return {
      width,
      height,
      backdropClass: 'backdrop',
      panelClass: 'panel',
      hasBackdrop: true,
      positionStrategy,
    };
  }
}
