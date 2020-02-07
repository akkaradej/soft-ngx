import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { PopupModule } from '../popup/popup.module';
import { windowToken, getWindow } from '../window';

import { ApiClientConfig } from './api-client.config';
import { ApiClientService } from './api-client.service';
import { userApiClientConfigToken } from './user-config.token';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    PopupModule
  ]
})
export class ApiClientModule {
  static forRoot(
    config?: ApiClientConfig
  ): ModuleWithProviders<ApiClientModule> {
    return {
      ngModule: ApiClientModule,
      providers: [
        { provide: userApiClientConfigToken, useValue: config },
        { provide: windowToken, useFactory: getWindow },
        ApiClientService
      ]
    };
  }
}
