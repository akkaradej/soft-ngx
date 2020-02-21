import { Directive, Input } from '@angular/core';
import { PromiseBtnDirective } from 'angular2-promise-buttons';

@Directive({
  selector: '[softLoading]',
})
export class SoftLoadingDirective extends PromiseBtnDirective {

  @Input()
  set softLoading(passedValue: any) {
    this.cfg.btnLoadingClass = 'is-loading';
    this.cfg.spinnerTpl = '';
    this.promiseBtn = passedValue;
  }
}
