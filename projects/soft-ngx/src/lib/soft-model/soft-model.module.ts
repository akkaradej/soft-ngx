import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SoftCompareByDirective, SoftCompareByOptionDirective } from './soft-compare-by.directive';
import { SoftFileModelDirective } from './soft-file-model.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  declarations: [
    SoftCompareByDirective,
    SoftCompareByOptionDirective,
    SoftFileModelDirective,
  ],
  exports: [
    SoftCompareByDirective,
    SoftCompareByOptionDirective,
    SoftFileModelDirective,
  ],
})
export class SoftModelModule {
  static forRoot(): ModuleWithProviders<SoftModelModule> {
    return {
      ngModule: SoftModelModule,
      providers: [],
    };
  }
}
