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
import { SoftUIStateModule } from './soft-ui-state/soft-ui-state.module';

import { SoftAuthService } from './soft-auth/soft-auth.service';
import { SoftApiClientConfig } from './soft-api-client/soft-api-client.config';
import {
  SoftAuthServiceConfig, SoftAuthInterceptorConfig,
  SoftAuthRequestKey, SoftAuthResponseKey,
} from './soft-auth/soft-auth.config';
import { SoftPopupConfig } from './soft-popup/soft-popup.config';
import { SoftStorageConfig } from './soft-storage/soft-storage.config';
import { SoftUIStateConfig } from './soft-ui-state/soft-ui-state.config';

@NgModule({
  imports: [
    CommonModule,

    SoftApiClientModule,
    SoftAuthModule,
    SoftPopupModule,
    SoftScrollModule,
    SoftStorageModule,
    SoftUIStateModule,
  ],
  exports: [
    SoftModalModule,
    SoftModelModule,
    SoftPipeModule,
    SoftUIStateModule,
  ],
})
export class SoftNgxModule {
  static forRoot(
    // tslint:disable-next-line: variable-name
    SoftAuthServiceClass: any = SoftAuthService,
    authConfig: {
      authServiceConfig?: SoftAuthServiceConfig,
      authInterceptorConfig?: SoftAuthInterceptorConfig,
      authRequestKey?: SoftAuthRequestKey,
      authResponseKey?: SoftAuthResponseKey,
    } = {},
    apiClientConfig?: SoftApiClientConfig,
    popupConfig?: SoftPopupConfig,
    storageConfig?: SoftStorageConfig,
    uiStateConfig?: SoftUIStateConfig,
  ): ModuleWithProviders<SoftNgxModule> {
    return {
      ngModule: SoftNgxModule,
      providers: [
        ...SoftApiClientModule.forRoot(apiClientConfig).providers,
        ...SoftAuthModule.forRoot(SoftAuthServiceClass, authConfig).providers,
        ...SoftPopupModule.forRoot(popupConfig).providers,
        ...SoftScrollModule.forRoot().providers,
        ...SoftStorageModule.forRoot(storageConfig).providers,
        ...SoftUIStateModule.forRoot(uiStateConfig).providers,
      ],
    };
  }
}
