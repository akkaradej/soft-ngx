import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { SoftAsyncUIConfig } from './soft-async-ui.config';
import { SoftBusyDirective } from './soft-busy.directive';
import { SoftDisabledDirective } from './soft-disabled.directive';
import { SoftLoadingDirective } from './soft-loading.directive';
import { userSoftAsyncUIConfigToken } from './user-config.token';
import { DefaultBusySpinnerComponent } from './default-busy-spinner/default-busy-spinner.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    SoftBusyDirective,
    SoftDisabledDirective,
    SoftLoadingDirective,
    DefaultBusySpinnerComponent,
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
  ): ModuleWithProviders<SoftAsyncUIModule> {
    return {
      ngModule: SoftAsyncUIModule,
      providers: [
        { provide: userSoftAsyncUIConfigToken, useValue: config },
      ],
    };
  }
}
