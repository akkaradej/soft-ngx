import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { SoftPopupService } from './soft-popup.service';
import { SoftPopupComponent } from './soft-popup.component';
import { SoftPopupConfig } from './soft-popup.config';
import { SoftDialogService } from './soft-dialog.service';
import { userSoftPopupConfigToken } from './user-config.token';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    SoftPopupComponent,
  ],
  exports: [
    SoftPopupComponent,
  ],
})
export class SoftPopupModule {
  static forRoot(
    config?: SoftPopupConfig,
  ): ModuleWithProviders<SoftPopupModule> {
    return {
      ngModule: SoftPopupModule,
      providers: [
        { provide: userSoftPopupConfigToken, useValue: config },
        SoftPopupService,
        SoftDialogService,
      ],
    };
  }
}
