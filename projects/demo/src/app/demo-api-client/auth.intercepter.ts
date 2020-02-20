import { Injectable, Inject } from '@angular/core';

import { AuthService } from './auth.service';
import {
  SoftAuthInterceptor,
  SoftAuthInterceptorConfig, userSoftAuthInterceptorConfigToken
} from 'soft-ngx';

@Injectable()
export class AuthInterceptor extends SoftAuthInterceptor {

  constructor(
    protected authService: AuthService,
    @Inject(userSoftAuthInterceptorConfigToken) userConfig: SoftAuthInterceptorConfig) {

    super(authService, userConfig);
  }
}
