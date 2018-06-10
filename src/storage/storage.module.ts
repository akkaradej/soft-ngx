import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders, Provider, ClassProvider } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { OAuthModule } from 'angular-oauth2-oidc';

import { StorageConfig } from './storage.config';
import { StorageService } from './storage.service';
import { userConfigToken } from './user-config.token';

@NgModule({
  imports: [
    CommonModule,
  ]
})
export class StorageModule {
  static forRoot(
    config: StorageConfig,
  ): ModuleWithProviders {

    return {
      ngModule: StorageModule,
      providers: [
        { provide: userConfigToken, useValue: config },
        StorageService
      ]
    };
  }
}