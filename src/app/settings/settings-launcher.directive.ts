import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  Injector,
  Renderer2,
} from '@angular/core';
import { SettingsComponent } from './settings/settings.component';

@Directive({
  selector: '[pomodoroSettingsLauncher]',
})
export class SettingsLauncherDirective implements AfterViewInit {
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private overlay: Overlay,
    private parentInjector: Injector
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
    const positionStrategy = this.overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically();
    return {
      width: 600,
      height: 400,
      backdropClass: 'backdrop',
      panelClass: 'panel',
      hasBackdrop: true,
      positionStrategy,
    };
  }
}
