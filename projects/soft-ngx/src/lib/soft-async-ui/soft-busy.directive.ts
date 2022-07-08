import { Directive, Inject, Input, ElementRef, Type, ComponentFactoryResolver, Injector, EmbeddedViewRef, OnInit, OnDestroy, OnChanges, SimpleChanges, ApplicationRef, ComponentRef } from '@angular/core';
import { Subscription } from 'rxjs';

import { SoftAsyncUIConfig } from './soft-async-ui.config';
import { userSoftAsyncUIConfigToken } from './user-config.token';
import { BaseAsyncUI } from './base-async-ui';
import { DefaultBusySpinnerComponent } from './default-busy-spinner/default-busy-spinner.component';

@Directive({
  selector: '[softBusy]',
})
export class SoftBusyDirective extends BaseAsyncUI implements OnInit, OnChanges, OnDestroy {

  @Input() softBusy: Subscription | Promise<any> | boolean;

  @Input() busyComponent: Type<any>;
  @Input() busyContainer: string;
  @Input() busyContainerMinHeight = 50;
  @Input() busyDelay: number;
  @Input() busyData: any;

  busyHTMLElement: HTMLElement;
  containerOriginalPosition: string;
  containerOriginalMinHeight: string;
  override config: SoftAsyncUIConfig;

  constructor(
    el: ElementRef,
    @Inject(userSoftAsyncUIConfigToken) userConfig: SoftAsyncUIConfig,
    private componentFactoryResolver: ComponentFactoryResolver,
    private applicationRef: ApplicationRef,
    private injector: Injector,
  ) {
    super(el, userConfig);
  }

  ngOnInit() {
    // create componentRef
    const componentRef = this.componentFactoryResolver
      .resolveComponentFactory(this.busyComponent || DefaultBusySpinnerComponent)
      .create(this.injector);
    this.applicationRef.attachView(componentRef.hostView);

    // pass data
    componentRef.instance.data = this.busyData || {};

    // convert to HTMLElement
    this.busyHTMLElement = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

    // destroy componentRef
    window.setTimeout(() => {
      this.applicationRef.detachView(componentRef.hostView);
      componentRef.destroy();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.softBusy) {
      this.setState(changes.softBusy.currentValue);
    }
  }

  override ngOnDestroy() {
    this.finishedState(this.element);
  }

  loadingState(element: HTMLElement) {
    let minDuration = this.config.minDuration || 0;
    if (this.minDuration != null) {
      minDuration = this.minDuration;
    }

    let busyDelay = this.config.busyDelay || 0;
    if (this.busyDelay != null) {
      busyDelay = this.busyDelay;
    }

    if (busyDelay < minDuration) {
      busyDelay = 0;
    }

    let containerMinHeight = this.config.busyContainerMinHeight;
    if (this.busyContainerMinHeight != null) {
      containerMinHeight = this.busyContainerMinHeight;
    }

    window.setTimeout(() => {
      if (!this.isPromiseDone) {
        let container = element;
        if (this.busyContainer) {
          container = element.closest(this.busyContainer);
        }
        if (container) {
          this.containerOriginalPosition = container.style.position;
          this.containerOriginalMinHeight = container.style.minHeight;
          container.style.position = 'relative';
          if (containerMinHeight) {
            container.style.minHeight = `${containerMinHeight}px`;
          }
          container.appendChild(this.busyHTMLElement);
        }
      }
    }, busyDelay);
  }

  finishedState(element: HTMLElement) {
    let container = element;
    if (this.busyContainer) {
      container = element.closest(this.busyContainer);
    }
    if (container && container.contains(this.busyHTMLElement)) {
      container.removeChild(this.busyHTMLElement);
      container.style.position = this.containerOriginalPosition;
      container.style.minHeight = this.containerOriginalMinHeight;
    }
  }

}
