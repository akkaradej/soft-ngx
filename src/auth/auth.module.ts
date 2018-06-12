import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { OAuthModule } from 'angular-oauth2-oidc';

import { WindowClass, getWindow } from '../window';

import { AuthConfig } from './auth.config';
import { AuthInterceptor } from "./auth.interceptor";
import { AuthServiceBase } from './auth.service';
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
    config?: AuthConfig,
    CustomAuthService?: (new (...args: any[]) => AuthServiceInterface)
  ): ModuleWithProviders {

    return {
      ngModule: AuthModule,
      providers: [
        { provide: userConfigToken, useValue: config },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: WindowClass, useFactory: getWindow },
        CustomAuthService ? { provide: AuthServiceBase, useClass: CustomAuthService } : AuthServiceBase
      ]
    };
  }
}