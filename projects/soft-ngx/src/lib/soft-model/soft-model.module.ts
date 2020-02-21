import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SoftCompareByDirective, SoftCompareByOptionDirective } from './soft-compare-by.directive';
import { SoftFileModelDirective } from './soft-file-model.directive';
import { SoftFormDirective } from './soft-form.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  declarations: [
    SoftCompareByDirective,
    SoftCompareByOptionDirective,
    SoftFileModelDirective,
    SoftFormDirective,
  ],
  exports: [
    SoftCompareByDirective,
    SoftCompareByOptionDirective,
    SoftFileModelDirective,
    SoftFormDirective,
  ],
})
export class SoftModelModule { }
