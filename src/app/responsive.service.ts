import { Injectable } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';

export const TABLET_BREAKPOINT = 768;
export const DESKTOP_BREAKPOINT = 1200;

// TODO: Can later refactor to support more granular responsiveness
export enum screenTypes {
  mobile = 'mobile',
  tablet = 'tablet',
  desktop = 'desktop',
}

export const BREAKPOINTS = {
  mobile: `(max-width: ${TABLET_BREAKPOINT - 1}px)`,
  tablet: `(min-width: ${TABLET_BREAKPOINT}px) and (max-width: ${
    DESKTOP_BREAKPOINT - 1
  }px)`,
  desktop: `(min-width: ${DESKTOP_BREAKPOINT}px`,
};

@Injectable({
  providedIn: 'root',
})
export class ResponsiveService {
  public screenType: screenTypes = screenTypes.mobile;
  constructor(private breakpointObserver: BreakpointObserver) {
    this.watchForBreakpointChanges().subscribe((state: BreakpointState) => {
      if (state.matches) {
        this._updateScreenPath();
      }
    });
  }

  private _updateScreenPath(): void {
    if (this.isMobileScreen) {
      this.screenType = screenTypes.mobile;
    } else if (this.isTabletScreen) {
      this.screenType = screenTypes.tablet;
    } else {
      this.screenType = screenTypes.desktop;
    }
  }
  public get isMobileScreen(): boolean {
    return this.breakpointObserver.isMatched(BREAKPOINTS.mobile);
  }

  public get isTabletScreen(): boolean {
    return this.breakpointObserver.isMatched(BREAKPOINTS.tablet);
  }

  public get isDesktopScreen(): boolean {
    return this.breakpointObserver.isMatched(BREAKPOINTS.desktop);
  }

  public watchForBreakpointChanges(): Observable<BreakpointState> {
    return this.breakpointObserver.observe([
      BREAKPOINTS.mobile,
      BREAKPOINTS.tablet,
      BREAKPOINTS.desktop,
    ]);
  }
}
