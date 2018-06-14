import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { StorageConfig } from './storage.config';
import { StorageService } from './storage.service';
import { userStorageConfigToken } from './user-config.token';

@NgModule({
  imports: [
    CommonModule,
  ]
})
export class StorageModule {
  static forRoot(
    config: StorageConfig,
  ): ModuleWithProviders {

    return {
      ngModule: StorageModule,
      providers: [
        { provide: userStorageConfigToken, useValue: config },
        StorageService
      ]
    };
  }
}