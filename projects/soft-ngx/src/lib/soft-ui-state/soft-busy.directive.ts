import { Directive, Inject, Input, ElementRef } from '@angular/core';
import { PromiseBtnDirective } from 'angular2-promise-buttons';

import { SoftUIStateConfig, defaultConfig } from './soft-ui-state.config';
import { userSoftUIStateConfigToken } from './user-config.token';

@Directive({
  selector: '[softBusy]',
})
export class SoftBusyDirective extends PromiseBtnDirective {
  config: SoftUIStateConfig;

  constructor(
    el: ElementRef,
    @Inject(userSoftUIStateConfigToken) userConfig: SoftUIStateConfig) {

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
  set softBusy(passedValue: any) {
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
    window.setTimeout(() => {
      if (!this.isPromiseDone) {
        this.addLoadingClass(btnEl);
      }
    }, this.config.busyDelay);
  }
}
