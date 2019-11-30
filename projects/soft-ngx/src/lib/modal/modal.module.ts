import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { windowToken, getWindow } from '../window';
import { ModalComponent, ModalTitleComponent } from './modal.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ModalComponent,
    ModalTitleComponent
  ],
  exports: [
    ModalComponent,
    ModalTitleComponent
  ]
})
export class ModalModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ModalModule,
      providers: [
        { provide: windowToken, useFactory: getWindow }
      ]
    };
  }
}
