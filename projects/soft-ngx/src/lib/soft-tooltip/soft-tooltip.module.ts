import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SoftTooltipDirective } from './soft-tooltip.directive';


@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    SoftTooltipDirective,
  ],
  exports: [
    SoftTooltipDirective,
  ],
})
export class SoftTooltipModule { }
