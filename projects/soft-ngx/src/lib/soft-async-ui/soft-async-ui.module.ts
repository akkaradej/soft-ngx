import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { SoftAsyncUIConfig, SoftBusyConfig } from './soft-async-ui.config';
import { SoftBusyDirective } from './soft-busy.directive';
import { SoftDisabledDirective } from './soft-disabled.directive';
import { SoftLoadingDirective } from './soft-loading.directive';
import { userSoftAsyncUIConfigToken, userSoftBusyฺConfigToken } from './user-config.token';

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
export class SoftAsyncUIModule {
  static forRoot(
    config?: SoftAsyncUIConfig,
    busyConfig?: SoftBusyConfig,
  ): ModuleWithProviders<SoftAsyncUIModule> {
    return {
      ngModule: SoftAsyncUIModule,
      providers: [
        { provide: userSoftAsyncUIConfigToken, useValue: config },
        { provide: userSoftBusyฺConfigToken, useValue: busyConfig },
      ],
    };
  }
}
