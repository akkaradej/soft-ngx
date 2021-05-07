import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { SoftApiClientConfig } from './soft-api-client.config';
import { SoftApiClientService } from './soft-api-client.service';
import { userSoftApiClientConfigToken } from './user-config.token';
import { SoftApiErrorHandlerService } from './soft-api-error-handler.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
  ],
})
export class SoftApiClientModule {
  static forRoot(
    config?: SoftApiClientConfig,
  ): ModuleWithProviders<SoftApiClientModule> {
    return {
      ngModule: SoftApiClientModule,
      providers: [
        { provide: userSoftApiClientConfigToken, useValue: config },
        SoftApiClientService,
        SoftApiErrorHandlerService,
      ],
    };
  }
}
