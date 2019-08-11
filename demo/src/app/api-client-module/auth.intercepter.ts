import { Injectable, Inject } from '@angular/core';

import { AuthService } from './auth.service';
import {
  AuthInterceptor as AuthInterceptorBase,
  AuthInterceptorConfig, userAuthInterceptorConfigToken
} from 'soft-ngx';

// Need Typescript >= 2.8.0 for extend AuthInterceptorBase
@Injectable()
export class AuthInterceptor extends AuthInterceptorBase {

  constructor(
    protected authService: AuthService,
    @Inject(userAuthInterceptorConfigToken) userConfig: AuthInterceptorConfig) {

    super(authService, window, userConfig);
  }
}
