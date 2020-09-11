import { Directive, Inject, Input, ElementRef, AfterContentInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { SoftAsyncUIConfig, defaultBusyConfig, SoftBusyConfig } from './soft-async-ui.config';
import { userSoftAsyncUIConfigToken, userSoftBusyฺConfigToken } from './user-config.token';
import { BaseAsyncUI } from './base-async-ui';

@Directive({
  selector: '[softBusy]',
})
export class SoftBusyDirective extends BaseAsyncUI implements AfterContentInit {

  @Input()
  set softBusy(state: Subscription | Promise<any> | boolean) {
    this.setState(state);
  }

  @Input() busyDelay: number;
  @Input() busyHTML: string;
  @Input() busyClass = '';

  config: SoftAsyncUIConfig & SoftBusyConfig;

  constructor(
    el: ElementRef,
    @Inject(userSoftAsyncUIConfigToken) userConfig: SoftAsyncUIConfig,
    @Inject(userSoftBusyฺConfigToken) userBusyConfig: SoftBusyConfig) {

    super(el, userConfig);
    this.config = Object.assign({}, this.config, defaultBusyConfig, userBusyConfig);
  }

  loadingState(element: HTMLElement) {
    const minDuration = this.minDuration || this.config.minDuration || 0;
    let busyDelay = this.busyDelay || this.config.busyDelay || 0;
    if (busyDelay < minDuration) {
      busyDelay = 0;
    }

    window.setTimeout(() => {
      if (!this.isPromiseDone) {
        element.insertAdjacentHTML('beforeend', `<div class="busy-wrapper ${this.busyClass}">${this.busyHTML || this.config.busyHTML}</div>`);
      }
    }, busyDelay);
  }

  finishedStateIfDone(element: HTMLElement) {
    const busyWrapper = document.querySelector('.busy-wrapper');
    if (busyWrapper) {
      element.removeChild(busyWrapper);
    }
  }

}
