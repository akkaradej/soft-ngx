import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { SoftStorageConfig } from './soft-storage.config';
import { SoftStorageService } from './soft-storage.service';
import { userSoftStorageConfigToken } from './user-config.token';

@NgModule({
  imports: [
    CommonModule,
  ],
})
export class SoftStorageModule {
  static forRoot(
    config?: SoftStorageConfig,
  ): ModuleWithProviders<SoftStorageModule> {
    return {
      ngModule: SoftStorageModule,
      providers: [
        { provide: userSoftStorageConfigToken, useValue: config },
        SoftStorageService,
      ],
    };
  }
}
