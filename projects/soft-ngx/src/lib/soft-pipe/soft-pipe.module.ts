import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { SafePipe } from './safe.pipe';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    SafePipe,
  ],
  exports: [
    SafePipe,
  ],
})
export class SoftPipeModule {
  static forRoot(): ModuleWithProviders<SoftPipeModule> {
    return {
      ngModule: SoftPipeModule,
      providers: [],
    };
  }
}
