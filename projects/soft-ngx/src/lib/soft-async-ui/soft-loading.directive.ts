import { Directive, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { BaseAsyncDisabled } from './base-async-disabled';

@Directive({
    selector: '[softLoading]',
    standalone: false
})
export class SoftLoadingDirective extends BaseAsyncDisabled {

  @Input() loadingClass = 'is-loading';

  @Input()
  set softLoading(state: Subscription | Promise<any> | boolean) {
    this.setState(state);
  }

  /**
   * Handles everything to be triggered when state is loading
   */
  override loadingState(element: HTMLElement) {
    this.addLoadingClass(element);
    super.loadingState(element);
  }

  /**
   * Handles everything to be triggered when state is finished
   */
  override finishedState(element: HTMLElement) {
    this.removeLoadingClass(element);
    super.finishedState(element);
  }

  private addLoadingClass(element: HTMLElement) {
    element.classList.add(this.loadingClass);
  }

  private removeLoadingClass(element: HTMLElement) {
    element.classList.remove(this.loadingClass);
  }
}
