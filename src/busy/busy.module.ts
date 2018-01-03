import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { Angular2PromiseButtonModule } from 'angular2-promise-buttons';

import { windowToken, getWindow } from '../window';

import { BusyConfig } from './busy.config';
import { BusyStateDirective } from './busy-state.directive';
import { DisabledStateDirective } from './disabled-state.directive';
import { LoadingStateDirective } from './loading-state.directive';
import { userConfigToken } from './user-config.token';

@NgModule({
  imports: [
    CommonModule,
    Angular2PromiseButtonModule.forRoot(),
  ],
  declarations: [
    BusyStateDirective,
    DisabledStateDirective,
    LoadingStateDirective
  ],
  exports: [
    BusyStateDirective,
    DisabledStateDirective,
    LoadingStateDirective
  ]
})
export class BusyModule {
  static forRoot(config?: BusyConfig): ModuleWithProviders {
    return {
      ngModule: BusyModule,
      providers: [
        { provide: userConfigToken, useValue: config },
        { provide: windowToken, useFactory: getWindow }
      ]
    };
  }
}