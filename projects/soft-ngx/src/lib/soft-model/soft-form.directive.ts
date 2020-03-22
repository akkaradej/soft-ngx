import { Directive, HostListener, HostBinding, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SoftScrollService } from '../soft-scroll/soft-scroll.service';

// closest for IE 9+
if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype['msMatchesSelector'] ||
    Element.prototype.webkitMatchesSelector;
}
if (!Element.prototype.closest) {
  Element.prototype.closest = function (s) {
    let el = this;

    do {
      if (el.matches(s)) { return el; }
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
}


@Directive({
  selector: '[softForm]',
})
export class SoftFormDirective {

  constructor(
    private form: NgForm,
    private elementRef: ElementRef,
    private scrollService: SoftScrollService,
  ) {
  }

  @HostBinding('class') formClass: string;

  @Input() softFormContainer: HTMLElement;
  @Output() softForm = new EventEmitter<NgForm>();

  @HostListener('ngSubmit') onSubmit() {
    const scrollingView = this.softFormContainer || this.elementRef.nativeElement.closest('.modal-card-body') || document.documentElement;
    this.scrollService.scrollTo(this.elementRef.nativeElement.querySelector('.ng-invalid'), scrollingView);
    this.formClass = 'submitted';
    this.softForm.emit(this.form);
  }
}
