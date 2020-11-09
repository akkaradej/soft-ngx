import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
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

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    SoftStorageModule,
  ],
})
export class SoftAuthModule {
  static forRoot(
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
      ],
    };
  }
}
