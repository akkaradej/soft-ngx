import { Directive, Input, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { BaseAsyncDisabled } from './base-async-disabled';

@Directive({
  selector: '[softLoadingBtn]',
})
export class SoftLoadingBtnDirective extends BaseAsyncDisabled {

  @Input() loadingClass = 'is-loading';

  isNewState = false;
  @Input()
  set softLoadingBtn(state: Subscription | Promise<any> | boolean) {
    this.isNewState = true;
    this.setState(state);
    // reset isNewState flag after setState
    this.isNewState = false;
  }

  isClicked = false;
  @HostListener('click')
  handleCurrentBtnOnly() {
    this.isClicked = true;

    // reset isClicked flag after click
    window.setTimeout(() => {
      this.isClicked = false;
    });
  }

  /**
   * Handles everything to be triggered when state is loading
   */
   loadingState(element: HTMLElement) {
    // only display loading for clicked element
    if (this.isClicked && this.isNewState) {
      this.addLoadingClass(element);
    }
    super.loadingState(element);
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
