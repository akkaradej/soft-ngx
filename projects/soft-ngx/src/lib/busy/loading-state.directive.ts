import { Directive, Input, ElementRef } from '@angular/core';
import { PromiseBtnDirective } from 'angular2-promise-buttons';

@Directive({
  selector: '[loadingState]'
})
export class LoadingStateDirective extends PromiseBtnDirective {

  @Input()
  set loadingState(passedValue: any) {
    this.cfg.btnLoadingClass = 'is-loading';
    this.cfg.spinnerTpl = '';
    this.promiseBtn = passedValue;
  }
}
