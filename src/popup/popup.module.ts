import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { BootstrapModalModule } from 'ng2-bootstrap-modal';

import { PopupService } from './popup.service';
import { PopupComponent } from './popup.component';

@NgModule({
  imports: [
    CommonModule,
    BootstrapModalModule
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
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: PopupModule,
      providers: [PopupService]
    };
  }
}