import { Directive, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { BaseAsyncDisabled } from './base-async-disabled';

@Directive({
  selector: '[softDisabled]',
})
export class SoftDisabledDirective extends BaseAsyncDisabled {

  @Input()
  set softDisabled(state: Subscription | Promise<any> | boolean) {
    this.setState(state);
  }
}
