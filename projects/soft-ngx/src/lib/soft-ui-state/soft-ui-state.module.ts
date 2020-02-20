import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { Angular2PromiseButtonModule } from 'angular2-promise-buttons';

import { SoftUIStateConfig } from './soft-ui-state.config';
import { SoftBusyDirective } from './soft-busy.directive';
import { SoftDisabledDirective } from './soft-disabled.directive';
import { SoftLoadingDirective } from './soft-loading.directive';
import { userSoftUIStateConfigToken } from './user-config.token';

@NgModule({
  imports: [
    CommonModule,
    Angular2PromiseButtonModule.forRoot(),
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
  ): ModuleWithProviders<SoftUIStateModule> {
    return {
      ngModule: SoftUIStateModule,
      providers: [
        { provide: userSoftUIStateConfigToken, useValue: config },
      ],
    };
  }
}
