import { Directive, Input, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { BaseAsyncDisabled } from './base-async-disabled';

@Directive({
  selector: '[softLoadingBtn]',
})
export class SoftLoadingBtnDirective extends BaseAsyncDisabled {

  @Input() loadingClass = 'is-loading';

  @Input()
  set softLoadingBtn(state: Subscription | Promise<any> | boolean) {
    this.setState(state);
  }

  @HostListener('click')
  handleCurrentBtnOnly() {
    // Click triggers @Input update
    // We need to use timeout to wait for @Input to update
    window.setTimeout(() => {
      // return if something else than a promise is passed
      if (!this.promise) {
        return;
      }

      // only display loading for clicked element
      this.addLoadingClass(this.element);
    }, 0);
  }

  /**
   * Handles everything to be triggered when state is finished
   */
  finishedState(element: HTMLElement) {
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
