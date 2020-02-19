import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { PopupService } from './popup.service';
import { PopupComponent } from './popup.component';
import { PopupConfig } from './popup.config';
import { userPopupConfigToken } from './user-config.token';
import { DialogService } from './dialog.service';

@NgModule({
  imports: [
    CommonModule,
    DialogService,
  ],
  declarations: [
    PopupComponent
  ],
  entryComponents: [
    PopupComponent
  ],
  exports: [
    PopupComponent
  ]
})
export class PopupModule {
  static forRoot(
    config?: PopupConfig
  ): ModuleWithProviders<PopupModule> {
    return {
      ngModule: PopupModule,
      providers: [
        { provide: userPopupConfigToken, useValue: config },
        PopupService
      ]
    };
  }
}
