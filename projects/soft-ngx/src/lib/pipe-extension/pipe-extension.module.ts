import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { SafePipe } from './safe.pipe';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    SafePipe
  ],
  exports: [
    SafePipe
  ]
})
export class PipeExtensionModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: PipeExtensionModule,
      providers: []
    };
  }
}
