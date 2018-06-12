import { Injectable, Inject } from '@angular/core';

import { CustomAuthService } from './custom-auth.service';
import { AuthInterceptor, authUserConfigToken, AuthConfig } from 'soft-ngx';

@Injectable()
export class CustomAuthInterceptor extends AuthInterceptor {

  constructor(
    protected authService: CustomAuthService,
    @Inject(authUserConfigToken) config: AuthConfig) {

    super(authService, config);
  }
}