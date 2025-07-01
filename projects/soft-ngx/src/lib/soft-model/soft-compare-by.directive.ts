import { Directive, ElementRef, Renderer2, Optional, Host, Input, forwardRef, HostListener } from '@angular/core';
import { SelectControlValueAccessor, NgSelectOption, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
    selector: '[ngModel][softCompareBy]',
    providers: [{
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SoftCompareByDirective),
            multi: true,
        }],
    standalone: false
})
export class SoftCompareByDirective extends SelectControlValueAccessor {

  @HostListener('change', ['$event'])
  onHostChange(event) {
    this.onChange(event.target.value);
  }

  @HostListener('blur')
  onHostBlur() {
    this.onTouched();
  }

  @Input()
  set softCompareBy(prop: string) {
    this.compareWith = (o1: any, o2: any) => {
      return o1 && o2 ? o1[prop] === o2[prop] : o1 === o2;
    };
  }
}

@Directive({
    selector: 'option',
    standalone: false
})
export class SoftCompareByOptionDirective extends NgSelectOption {

  constructor(
    _element: ElementRef,
    _renderer: Renderer2,
    @Optional() @Host() _select: SoftCompareByDirective) {
    super(_element, _renderer, _select);
  }
}
