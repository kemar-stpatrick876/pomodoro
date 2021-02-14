import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsLauncherDirective } from './settings-launcher.directive';
import { PortalModule } from '@angular/cdk/portal';
import { OverlayModule } from '@angular/cdk/overlay';
import { RadioGroupComponent } from './settings/radio-group/radio-group.component';
import { TimeInputsComponent } from './settings/time-inputs/time-inputs.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SettingsComponent } from './settings/settings.component';
@NgModule({
  declarations: [SettingsComponent, SettingsLauncherDirective, RadioGroupComponent, TimeInputsComponent],
  exports: [SettingsLauncherDirective],
  imports: [CommonModule, OverlayModule, PortalModule, FormsModule, ReactiveFormsModule],
})
export class SettingsModule {}
