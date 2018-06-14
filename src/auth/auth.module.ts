import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { WindowClass, getWindow } from '../window';

import {
  AuthServiceConfig, AuthInterceptorConfig,
  NonOAuthRequestKey, NonOAuthResponseKey
} from './auth.config';
import {
  userAuthServiceConfigToken, userAuthInterceptorConfigToken,
  userNonOAuthRequestKeyToken, userNonOAuthResponseKeyToken
} from './user-config.token';
import { AuthInterceptor } from "./auth.interceptor";

@NgModule({
  imports: [
    CommonModule
  ]
})
export class AuthModule {
  static forRoot(
    config: {
      authServiceConfig?: AuthServiceConfig,
      authInterceptorConfig?: AuthInterceptorConfig,
      nonOAuthRequestKey?: NonOAuthRequestKey,
      nonOAuthResponseKey?: NonOAuthResponseKey,
    } = {}
  ): ModuleWithProviders {

    return {
      ngModule: AuthModule,
      providers: [
        { provide: userAuthServiceConfigToken, useValue: config.authServiceConfig },
        { provide: userAuthInterceptorConfigToken, useValue: config.authInterceptorConfig },
        { provide: userNonOAuthRequestKeyToken, useValue: config.nonOAuthRequestKey },
        { provide: userNonOAuthResponseKeyToken, useValue: config.nonOAuthResponseKey },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: WindowClass, useFactory: getWindow }
      ]
    };
  }
}