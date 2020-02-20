import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { SoftStorageModule } from '../soft-storage/soft-storage.module';
import {
  SoftAuthServiceConfig, SoftAuthInterceptorConfig,
  SoftAuthRequestKey, SoftAuthResponseKey,
} from './soft-auth.config';
import {
  userSoftAuthServiceConfigToken, userSoftAuthInterceptorConfigToken,
  userSoftAuthRequestKeyToken, userSoftAuthResponseKeyToken,
} from './user-config.token';
import { SoftAuthInterceptor } from './soft-auth.interceptor';
import { SoftAuthService } from './soft-auth.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    SoftStorageModule,
  ],
})
export class SoftAuthModule {
  static forRoot(
    // tslint:disable-next-line: variable-name
    SoftAuthServiceClass: any = SoftAuthService,
    config: {
      authServiceConfig?: SoftAuthServiceConfig,
      authInterceptorConfig?: SoftAuthInterceptorConfig,
      authRequestKey?: SoftAuthRequestKey,
      authResponseKey?: SoftAuthResponseKey,
    } = {},
  ): ModuleWithProviders<SoftAuthModule> {
    return {
      ngModule: SoftAuthModule,
      providers: [
        { provide: userSoftAuthServiceConfigToken, useValue: config.authServiceConfig },
        { provide: userSoftAuthInterceptorConfigToken, useValue: config.authInterceptorConfig },
        { provide: userSoftAuthRequestKeyToken, useValue: config.authRequestKey },
        { provide: userSoftAuthResponseKeyToken, useValue: config.authResponseKey },
        { provide: SoftAuthService, useClass: SoftAuthServiceClass },
        { provide: HTTP_INTERCEPTORS, useClass: SoftAuthInterceptor, multi: true },
      ],
    };
  }
}
