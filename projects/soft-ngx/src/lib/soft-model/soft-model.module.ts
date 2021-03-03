import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SoftScrollModule } from '../soft-scroll/soft-scroll.module';

import { SoftCompareByDirective, SoftCompareByOptionDirective } from './soft-compare-by.directive';
import { SoftFileModelDirective } from './soft-file-model.directive';
import { SoftFormDirective } from './soft-form.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SoftScrollModule,
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
