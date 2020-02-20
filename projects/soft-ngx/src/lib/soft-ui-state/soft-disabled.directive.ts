import { Directive, Input } from '@angular/core';
import { PromiseBtnDirective } from 'angular2-promise-buttons';

@Directive({
  selector: '[softDisabled]',
})
export class SoftDisabledDirective extends PromiseBtnDirective {

  @Input()
  set softDisabled(passedValue: any) {
    if (this.btnEl.hasAttribute('disabled')) {
      this.cfg.disableBtn = false;
    }
    this.cfg.btnLoadingClass = 'just-disabled'; // no defined class, just override is-loading
    this.cfg.spinnerTpl = '';
    this.promiseBtn = passedValue;
  }
}
