import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { WindowClass, getWindow } from '../window';

import { BsDatepickerExtendDirective } from './bs-datepicker-extend.directive';
import { CompareByDirective, CompareBySelectOption } from './compare-by.directive';
import { FileModelDirective } from './file-model.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    BsDatepickerExtendDirective,
    CompareByDirective,
    CompareBySelectOption,
    FileModelDirective
  ],
  exports: [
    BsDatepickerExtendDirective,
    CompareByDirective,
    CompareBySelectOption,
    FileModelDirective
  ]
})
export class ModelHelperModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ModelHelperModule,
      providers: [
        { provide: WindowClass, useFactory: getWindow }
      ]
    };
  }
}