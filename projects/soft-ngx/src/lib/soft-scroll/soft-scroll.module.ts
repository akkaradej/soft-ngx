import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { SoftScrollService } from './soft-scroll.service';

@NgModule({
  imports: [
    CommonModule,
  ],
})
export class SoftScrollModule {
  static forRoot(
  ): ModuleWithProviders<SoftScrollModule> {
    return {
      ngModule: SoftScrollModule,
      providers: [
        SoftScrollService,
      ],
    };
  }
}
