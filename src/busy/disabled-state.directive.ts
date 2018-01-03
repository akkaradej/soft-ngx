import { Directive, Input, ElementRef } from '@angular/core';
import { PromiseBtnDirective } from 'angular2-promise-buttons';

@Directive({
  selector: '[disabledState]'
})
export class DisabledStateDirective extends PromiseBtnDirective {

  @Input()
  set disabledState(passedValue: any) {
    if (this.btnEl.hasAttribute('disabled')) {
      this.cfg.disableBtn = false;
    }
    this.cfg.btnLoadingClass = 'just-disabled'; // no defined class, just overide is-loading
    this.cfg.spinnerTpl = '';
    this.promiseBtn = passedValue;
  }
}