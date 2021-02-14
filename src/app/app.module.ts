import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SettingsModule } from './settings/settings.module';
import { StatusBarComponent } from './status-bar/status-bar.component';
import { TimerComponent } from './timer/timer.component';

@NgModule({
  declarations: [
    AppComponent,
    StatusBarComponent,
    TimerComponent
  ],
  imports: [
    BrowserModule,
    SettingsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
