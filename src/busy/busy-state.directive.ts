import { Directive, Inject, Input, ElementRef, Optional } from '@angular/core';
import { PromiseBtnDirective } from 'angular2-promise-buttons';
import { PromiseBtnConfig } from 'angular2-promise-buttons/dist/promise-btn-config';

import { WindowClass, getWindow } from '../window';

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
    // inject window that make easy to test
    protected window: WindowClass = getWindow()) {

    super(el, {});
    this.config = Object.assign({}, defaultConfig, userConfig);

    console.log(this.window);
    if (!this.window) {
      this.window = getWindow();
    }
  }

  @Input()
  set busyState(passedValue: any) {
    this.cfg.disableBtn = false;
    this.cfg.btnLoadingClass = 'is-show-busy-spinner';
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
              <div class="ng-busy-default-text">Please wait...</div>
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
    this.window.setTimeout(() => {
      if (!this.isPromiseDone) {
        this.addLoadingClass(btnEl);
      }
    }, this.config.busyDelay);
  }
}
