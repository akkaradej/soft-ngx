import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AuthModule } from '../auth/auth.module';
import { PopupModule } from '../popup/popup.module';
import { windowToken, getWindow } from '../window';

import { ApiClientConfig } from './api-client.config';
import { ApiClientService } from './api-client.service';
import { userConfigToken } from './user-config.token';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    AuthModule,
    PopupModule
  ]
})
export class ApiClientModule {
  static forRoot(
    config: ApiClientConfig
  ): ModuleWithProviders {

    return {
      ngModule: ApiClientModule,
      providers: [
        { provide: userConfigToken, useValue: config },
        { provide: windowToken, useFactory: getWindow },
        ApiClientService
      ]
    };
  }
}