// inspired by https://github.com/johannesjo/angular2-promise-buttons/blob/master/projects/angular2-promise-buttons/src/promise-btn.directive.ts

import { AfterContentInit, Directive, ElementRef, Inject, OnDestroy, Input } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { SoftUIStateConfig } from './soft-ui-state.config';
import { userSoftUIStateConfigToken } from './user-config.token';

@Directive()
export abstract class BaseUIState implements OnDestroy, AfterContentInit {

  @Input() minDuration: number;

  config: SoftUIStateConfig;

  minDurationTimeout: number;
  isMinDurationTimeoutDone: boolean;
  isPromiseDone: boolean;

  element: HTMLElement;
  promise: Promise<any>;

  private fakePromiseResolve: () => void;

  constructor(
    el: ElementRef,
    @Inject(userSoftUIStateConfigToken) userConfig: SoftUIStateConfig) {

    this.config = Object.assign({}, userConfig);
    this.element = el.nativeElement;
  }

  ngAfterContentInit() {
    // trigger changes once to handle initial promises
    this.checkAndInitStateHandler(this.element);
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
  abstract finishedStateIfDone(element: HTMLElement);

  /**
   * Keep track state inform of Promise
   */
  setState(state: Subscription | Promise<any> | boolean) {
    const isObservable: boolean = state instanceof Observable;
    const isSubscription: boolean = state instanceof Subscription;
    const isBoolean: boolean = typeof state === 'boolean';
    const isPromise: boolean = state instanceof Promise || (
      state !== null &&
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
      this.promise = this.createPromiseFromBoolean(state as boolean);
    }

    this.checkAndInitStateHandler(this.element);
  }

  private createPromiseFromBoolean(val: boolean): Promise<any> {
    if (val) {
      return new Promise((resolve) => {
        this.fakePromiseResolve = resolve;
      });
    } else {
      if (this.fakePromiseResolve) {
        this.fakePromiseResolve();
      }
      return this.promise;
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
        if ((!(this.minDuration || this.config.minDuration) || this.isMinDurationTimeoutDone) && this.isPromiseDone) {
          this.finishedStateIfDone(element);
        }
      }, this.minDuration || this.config.minDuration);
    }

    const resolveLoadingState = () => {
      this.isPromiseDone = true;
      if ((!(this.minDuration || this.config.minDuration) || this.isMinDurationTimeoutDone) && this.isPromiseDone) {
        this.finishedStateIfDone(element);
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
