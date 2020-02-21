import { Directive, HostListener, HostBinding, ElementRef, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SoftScrollService } from '../soft-scroll/soft-scroll.service';

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

  @Output() softForm = new EventEmitter<NgForm>();

  @HostListener('ngSubmit') onSubmit() {
    this.scrollService.scrollTo(this.elementRef.nativeElement.querySelector('.ng-invalid'));
    this.formClass = 'submitted';
    this.softForm.emit(this.form);
  }
}
