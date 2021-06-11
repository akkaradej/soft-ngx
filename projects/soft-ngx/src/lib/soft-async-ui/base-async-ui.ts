// inspired by https://github.com/johannesjo/angular2-promise-buttons/blob/master/projects/angular2-promise-buttons/src/promise-btn.directive.ts

import { Directive, ElementRef, Inject, OnDestroy, Input } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { SoftAsyncUIConfig, defaultConfig } from './soft-async-ui.config';
import { userSoftAsyncUIConfigToken } from './user-config.token';

@Directive()
export abstract class BaseAsyncUI implements OnDestroy {

  @Input() minDuration: number;

  config: SoftAsyncUIConfig;

  minDurationTimeout: number;
  isMinDurationTimeoutDone: boolean;
  isPromiseDone: boolean;

  element: HTMLElement;
  promise: Promise<any>;

  private fakePromiseResolve: () => void;

  constructor(
    el: ElementRef,
    @Inject(userSoftAsyncUIConfigToken) userConfig: SoftAsyncUIConfig) {

    this.config = Object.assign({}, defaultConfig, userConfig);
    this.element = el.nativeElement;
  }

  ngOnDestroy() {
    // cleanup
    if (this.minDurationTimeout) {
      clearTimeout(this.minDurationTimeout);
    }
  }

  /**
   * Handles everything to be triggered when state is loading
   */
  abstract loadingState(element: HTMLElement);

  /**
   * Handles everything to be triggered when state is finished
   */
  abstract finishedState(element: HTMLElement);

  /**
   * Keep track state inform of Promise
   */
  setState(state: Subscription | Promise<any> | boolean) {
    const isObservable: boolean = state instanceof Observable;
    const isSubscription: boolean = state instanceof Subscription;
    const isBoolean: boolean = typeof state === 'boolean';
    const isPromise: boolean = state instanceof Promise || (
      state != null &&
      typeof state === 'object' &&
      typeof (state as any).then === 'function' &&
      typeof (state as any).catch === 'function'
    );

    if (isObservable) {
      throw new TypeError('state must be an instance of Subscription, instance of Observable given');
    } else if (isSubscription) {
      const sub = state as Subscription;
      if (!sub.closed) {
        this.promise = new Promise((resolve) => {
          sub.add(resolve);
        });
      }
    } else if (isPromise) {
      this.promise = state as Promise<any>;
    } else if (isBoolean) {
      const promise = this.createPromiseFromBoolean(state as boolean);
      // skip if false state
      if (!promise) {
        return;
      }
      this.promise = promise;
    }

    this.checkAndInitStateHandler(this.element);
  }

  private createPromiseFromBoolean(val: boolean): Promise<void> | null {
    if (val) {
      return new Promise((resolve) => {
        this.fakePromiseResolve = resolve;
      });
    } else {
      if (this.fakePromiseResolve) {
        this.fakePromiseResolve();
        this.fakePromiseResolve = undefined;
      }
      return null;
    }
  }

  /**
   * Checks if all required parameters are there and inits the promise handler
   */
  private checkAndInitStateHandler(element: HTMLElement) {
    // check if element and promise is set
    if (element && this.promise) {
      this.initPromiseHandler(element);
    }
  }

  /**
   * Initializes a watcher for the promise. Also takes
   * minDuration into account if given.
   */
  private initPromiseHandler(element: HTMLElement) {
    const promise = this.promise;

    // watch promise to resolve or fail
    this.isMinDurationTimeoutDone = false;
    this.isPromiseDone = false;

    // create timeout if option is set
    if (this.minDuration || this.config.minDuration) {
      this.minDurationTimeout = window.setTimeout(() => {
        this.isMinDurationTimeoutDone = true;
        // skip if not current promise
        if (promise !== this.promise) {
          return;
        }
        if ((!(this.minDuration || this.config.minDuration) || this.isMinDurationTimeoutDone) && this.isPromiseDone) {
          this.finishedState(element);
        }
      }, this.minDuration || this.config.minDuration);
    }

    const resolveLoadingState = () => {
      this.isPromiseDone = true;
      // skip if not current promise
      if (promise !== this.promise) {
        return;
      }
      if ((!(this.minDuration || this.config.minDuration) || this.isMinDurationTimeoutDone) && this.isPromiseDone) {
        this.finishedState(element);
      }
    };

    this.loadingState(element);

    // native Promise doesn't have finally
    if (promise.finally) {
      promise.finally(resolveLoadingState);
    } else {
      promise
        .then(resolveLoadingState)
        .catch(resolveLoadingState);
    }

  }


}
