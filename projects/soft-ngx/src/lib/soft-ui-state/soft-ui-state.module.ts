import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { SoftUIStateConfig, SoftBusyConfig } from './soft-ui-state.config';
import { SoftBusyDirective } from './soft-busy.directive';
import { SoftDisabledDirective } from './soft-disabled.directive';
import { SoftLoadingDirective } from './soft-loading.directive';
import { userSoftUIStateConfigToken, userSoftBusyฺConfigToken } from './user-config.token';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    SoftBusyDirective,
    SoftDisabledDirective,
    SoftLoadingDirective,
  ],
  exports: [
    SoftBusyDirective,
    SoftDisabledDirective,
    SoftLoadingDirective,
  ],
})
export class SoftUIStateModule {
  static forRoot(
    config?: SoftUIStateConfig,
    busyConfig?: SoftBusyConfig,
  ): ModuleWithProviders<SoftUIStateModule> {
    return {
      ngModule: SoftUIStateModule,
      providers: [
        { provide: userSoftUIStateConfigToken, useValue: config },
        { provide: userSoftBusyฺConfigToken, useValue: busyConfig },
      ],
    };
  }
}
