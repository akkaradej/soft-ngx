import { Directive, Inject, Input, ElementRef, Optional } from '@angular/core';
import { PromiseBtnDirective } from 'angular2-promise-buttons';

import { WindowClass, windowToken } from '../window';

import { BusyConfig, defaultConfig } from './busy.config';
import { userConfigToken } from './user-config.token';

@Directive({
  selector: '[busyState]'
})
export class BusyStateDirective extends PromiseBtnDirective {
  config: BusyConfig;

  constructor(
    el: ElementRef,
    @Inject(userConfigToken) userConfig: BusyConfig,
    @Inject(windowToken) protected _window: WindowClass) {

    super(el, {});
    this.config = Object.assign({}, defaultConfig, userConfig);
    this.cfg.btnLoadingClass = 'show-busy-spinner';
  }

  @Input()
  set hideBackdrop(isHide: boolean) {
    if (isHide) {
      this.cfg.btnLoadingClass = 'show-busy-spinner-no-backdrop';
    } else {
      this.cfg.btnLoadingClass = 'show-busy-spinner';
    }
  }

  @Input()
  set busyState(passedValue: any) {
    this.cfg.disableBtn = false;
    this.cfg.spinnerTpl = `
      <div class="busy-spinner">
        <div class="ng-busy">
          <div class="ng-busy-default-wrapper">
            <div class="ng-busy-default-sign">
              <div class="ng-busy-default-spinner">
                  <div class="bar1"></div>
                  <div class="bar2"></div>
                  <div class="bar3"></div>
                  <div class="bar4"></div>
                  <div class="bar5"></div>
                  <div class="bar6"></div>
                  <div class="bar7"></div>
                  <div class="bar8"></div>
                  <div class="bar9"></div>
                  <div class="bar10"></div>
                  <div class="bar11"></div>
                  <div class="bar12"></div>
              </div>
              <div class="ng-busy-default-text">${this.config.busyText}</div>
            </div>
          </div>
        </div>
        <div class="ng-busy-backdrop">
        </div>
      </div>
    `;
    this.promiseBtn = passedValue;
  }

  // Override to add delay before start
  initLoadingState(btnEl: HTMLElement) {
    this._window.setTimeout(() => {
      if (!this.isPromiseDone) {
        this.addLoadingClass(btnEl);
      }
    }, this.config.busyDelay);
  }
}
