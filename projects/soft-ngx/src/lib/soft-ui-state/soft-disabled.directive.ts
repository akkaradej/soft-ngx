import { Directive, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { BaseDisabledState } from './base-disabled-state';

@Directive({
  selector: '[softDisabled]',
})
export class SoftDisabledDirective extends BaseDisabledState {

  @Input()
  set softDisabled(state: Subscription | Promise<any> | boolean) {
    this.setState(state);
  }
}
