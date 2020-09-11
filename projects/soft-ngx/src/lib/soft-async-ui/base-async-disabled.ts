import { Directive, Input } from '@angular/core';
import { BaseAsyncUI } from './base-async-ui';

@Directive()
export class BaseAsyncDisabled extends BaseAsyncUI {

  private isDisabledFromTheOutside: boolean;

  @Input('disabled')
  set isDisabledFromTheOutsideSetter(disabled: boolean) {
    this.isDisabledFromTheOutside = disabled;
    if (disabled) {
      // disabled means always disabled
      this.element.setAttribute('disabled', 'disabled');
    } else if (this.isPromiseDone || this.isPromiseDone === undefined) {
      this.element.removeAttribute('disabled');
    }
    // else the element is loading, so do not change the disabled loading state.
  }

  /**
   * Handles everything to be triggered when state is loading
   */
  loadingState(element: HTMLElement) {
    this.disableElement(element);
  }

  /**
   * Handles everything to be triggered when state is finished
   */
  finishedStateIfDone(element: HTMLElement) {
    this.enableElement(element);
  }

  private disableElement(element: HTMLElement) {
    element.setAttribute('disabled', 'disabled');
  }

  private enableElement(element: HTMLElement) {
    if (this.isDisabledFromTheOutside) {
      element.setAttribute('disabled', 'disabled');
    } else {
      element.removeAttribute('disabled');
    }
  }
}
