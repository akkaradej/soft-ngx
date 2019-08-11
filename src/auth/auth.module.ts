import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { StorageModule } from '../storage/storage.module';
import { windowToken, getWindow } from '../window';

import {
  AuthServiceConfig, AuthInterceptorConfig,
  CustomAuthRequestKey, CustomAuthResponseKey
} from './auth.config';
import {
  userAuthServiceConfigToken, userAuthInterceptorConfigToken,
  userCustomAuthRequestKeyToken, userCustomAuthResponseKeyToken
} from './user-config.token';
import { AuthInterceptor } from "./auth.interceptor";


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StorageModule
  ]
})
export class AuthModule {
  static forRoot(
    config: {
      authServiceConfig?: AuthServiceConfig,
      authInterceptorConfig?: AuthInterceptorConfig,
      customAuthRequestKey?: CustomAuthRequestKey,
      customAuthResponseKey?: CustomAuthResponseKey,
    } = {}
  ): ModuleWithProviders {

    return {
      ngModule: AuthModule,
      providers: [
        { provide: userAuthServiceConfigToken, useValue: config.authServiceConfig },
        { provide: userAuthInterceptorConfigToken, useValue: config.authInterceptorConfig },
        { provide: userCustomAuthRequestKeyToken, useValue: config.customAuthRequestKey },
        { provide: userCustomAuthResponseKeyToken, useValue: config.customAuthResponseKey },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: windowToken, useFactory: getWindow }
      ]
    };
  }
}