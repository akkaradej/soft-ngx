import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders, Provider, ClassProvider } from '@angular/core';
import { OAuthModule } from 'angular-oauth2-oidc';

import { StorageModule } from '../storage/storage.module';
import { windowToken, getWindow } from '../window';

import { AuthConfig } from './auth.config';
import { AuthService } from './auth.service';
import { AuthServiceInterface } from './auth.service.interface';
import { userConfigToken } from './user-config.token';

@NgModule({
  imports: [
    CommonModule,
    OAuthModule.forRoot(),
  ]
})
export class AuthModule {
  static forRoot(
    config: AuthConfig,
    CustomAuthService?: (new (...args: any[]) => AuthServiceInterface)
  ): ModuleWithProviders {

    return {
      ngModule: AuthModule,
      providers: [
        { provide: userConfigToken, useValue: config },
        { provide: windowToken, useFactory: getWindow },
        CustomAuthService ? { provide: AuthService, useClass: CustomAuthService } : AuthService
      ]
    };
  }
}