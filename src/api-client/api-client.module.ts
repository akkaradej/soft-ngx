import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { OAuthModule } from 'angular-oauth2-oidc';

import { PopupModule } from '../popup/popup.module';
import { windowToken, getWindow } from '../window';

import { ApiClientConfig } from './api-client.config';
import { ApiClientService } from './api-client.service';
import { AuthService } from './auth.service';
import { StorageService } from './storage.service';
import { userConfigToken } from './user-config.token';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    OAuthModule.forRoot(),
    PopupModule.forRoot()
  ]
})
export class ApiClientModule {
  static forRoot(config: ApiClientConfig): ModuleWithProviders {
    return {
      ngModule: ApiClientModule,
      providers: [
        { provide: userConfigToken, useValue: config },
        { provide: windowToken, useFactory: getWindow },
        ApiClientService,
        AuthService,
        StorageService
      ]
    };
  }
}