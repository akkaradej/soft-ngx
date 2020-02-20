import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { SoftModalComponent, ModalTitleComponent } from './soft-modal.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    SoftModalComponent,
    ModalTitleComponent,
  ],
  exports: [
    SoftModalComponent,
    ModalTitleComponent,
  ],
})
export class SoftModalModule {
  static forRoot(): ModuleWithProviders<SoftModalModule> {
    return {
      ngModule: SoftModalModule,
      providers: [],
    };
  }
}