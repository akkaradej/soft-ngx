import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { SoftApiClientModule } from './soft-api-client/soft-api-client.module';
import { SoftAuthModule } from './soft-auth/soft-auth.module';
import { SoftModalModule } from './soft-modal/soft-modal.module';
import { SoftModelModule } from './soft-model/soft-model.module';
import { SoftPipeModule } from './soft-pipe/soft-pipe.module';
import { SoftPopupModule } from './soft-popup/soft-popup.module';
import { SoftScrollModule } from './soft-scroll/soft-scroll.module';
import { SoftStorageModule } from './soft-storage/soft-storage.module';
import { SoftAsyncUIModule } from './soft-async-ui/soft-async-ui.module';

import { SoftApiClientConfig } from './soft-api-client/soft-api-client.config';
import {
  SoftAuthServiceConfig, SoftAuthInterceptorConfig,
  SoftAuthRequestKey, SoftAuthResponseKey,
} from './soft-auth/soft-auth.config';
import { SoftPopupConfig } from './soft-popup/soft-popup.config';
import { SoftStorageConfig } from './soft-storage/soft-storage.config';
import { SoftTooltipModule } from './soft-tooltip/soft-tooltip.module';
import { SoftAsyncUIConfig, SoftSkeletonType } from './soft-async-ui/soft-async-ui.config';

@NgModule({
  imports: [
    CommonModule,

    SoftApiClientModule,
    SoftAsyncUIModule,
    SoftAuthModule,
    SoftPopupModule,
    SoftScrollModule,
    SoftStorageModule,
    SoftTooltipModule,
  ],
  exports: [
    SoftAsyncUIModule,
    SoftModalModule,
    SoftModelModule,
    SoftPipeModule,
    SoftTooltipModule,
  ],
})
export class SoftNgxModule {
  static forRoot(
    apiClientConfig?: SoftApiClientConfig,
    asyncUIConfig?: SoftAsyncUIConfig,
    registeredSkeletonComponents?: SoftSkeletonType,
    authConfig: {
      authServiceConfig?: SoftAuthServiceConfig,
      authInterceptorConfig?: SoftAuthInterceptorConfig,
      authRequestKey?: SoftAuthRequestKey,
      authResponseKey?: SoftAuthResponseKey,
    } = {},
    popupConfig?: SoftPopupConfig,
    storageConfig?: SoftStorageConfig,
  ): ModuleWithProviders<SoftNgxModule> {
    return {
      ngModule: SoftNgxModule,
      providers: [
        ...SoftApiClientModule.forRoot(apiClientConfig).providers,
        ...SoftAsyncUIModule.forRoot(asyncUIConfig, registeredSkeletonComponents).providers,
        ...SoftAuthModule.forRoot(authConfig).providers,
        ...SoftPopupModule.forRoot(popupConfig).providers,
        ...SoftScrollModule.forRoot().providers,
        ...SoftStorageModule.forRoot(storageConfig).providers,
      ],
    };
  }
}
