import { Directive, ElementRef, Output, EventEmitter, OnInit, OnDestroy, Input, NgZone, ViewContainerRef, TemplateRef, ViewChild, EmbeddedViewRef } from '@angular/core';
import tippy, { Placement } from 'tippy.js';

@Directive({
  selector: '[softTooltip]',
  exportAs: 'softTooltip',
})
export class SoftTooltipDirective implements OnInit, OnDestroy {

  @ViewChild('autofocus') autofocus: ElementRef;

  @Input() softTooltip: string | TemplateRef<any>;
  @Input() arrow = true;
  @Input() placement: Placement = 'top';
  @Input() trigger = 'mouseenter focus';
  @Input() triggerTarget: ElementRef | HTMLElement = null;
  @Input() hideOnClickOutside = true;
  @Input() zIndex = 1020;
  @Input() theme: string;

  @Output() softTooltipShown = new EventEmitter();
  @Output() softTooltipHidden = new EventEmitter();

  private tippyInstance;
  private isShow: boolean;
  private autofocusElement: HTMLElement;

  constructor(
    private elementRef: ElementRef,
    private viewContainerRef: ViewContainerRef,
    private zone: NgZone,
  ) {
  }

  ngOnInit() {
    if (this.softTooltip instanceof TemplateRef) {
      this.theme = `${this.theme} is-paddingless`;
    }

    this.zone.runOutsideAngular(() => {
      this.tippyInstance = tippy(this.elementRef.nativeElement, {
        appendTo: () => document.body,
        arrow: this.arrow,
        allowHTML: true,
        content: this.softTooltip instanceof TemplateRef ? null : this.softTooltip,
        hideOnClick: 'toggle',
        interactive: true,
        maxWidth: 'none',
        placement: this.placement,
        trigger: this.trigger,
        triggerTarget: this.triggerTarget ? this.triggerTarget : null as any,
        theme: this.theme,
        zIndex: this.zIndex,
        onClickOutside: (instance, event) => {
          this.zone.run(() => {
            if (this.hideOnClickOutside) {
              instance.hide();
            }
          });
        },
        onTrigger: this.onTrigger,
        onShown: (instance) => {
          if (this.autofocusElement) {
            this.autofocusElement.focus();
          }
          this.zone.run(() => {
            this.isShow = true;
            this.softTooltipShown.emit();
          });
        },
        onHidden: (instance) => {
          if (this.softTooltip instanceof TemplateRef) {
            this.zone.run(() => {
              this.viewContainerRef.clear();
              instance.setContent(null);
            });
          }
          this.autofocusElement = undefined;
          this.zone.run(() => {
            this.isShow = false;
            this.softTooltipHidden.emit();
          });
        },
      });
    });
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.tippyInstance) {
        this.tippyInstance.destroy();
      }
    });
  }

  show() {
    this.zone.runOutsideAngular(() => {
      this.onTrigger(this.tippyInstance, 'manual');
      this.tippyInstance.show();
    });
  }

  hide() {
    this.zone.runOutsideAngular(() => {
      this.tippyInstance.hide();
    });
  }

  toggle() {
    if (this.isShow) {
      this.hide();
    } else {
      this.show();
    }
  }

  private onTrigger = (instance, event) => {
    if (this.softTooltip instanceof TemplateRef) {
      let viewRef: EmbeddedViewRef<any>;
      this.zone.run(() => {
        viewRef = this.viewContainerRef.createEmbeddedView(this.softTooltip as TemplateRef<any>);
        instance.setContent(viewRef.rootNodes[0]);
        viewRef.markForCheck();
      });
      this.autofocusElement = viewRef.rootNodes[0].querySelector('[autofocus]');
      if (this.autofocusElement) {
        this.autofocusElement = this.autofocusElement.querySelector('input') || this.autofocusElement;
      }
    }
  }

}
