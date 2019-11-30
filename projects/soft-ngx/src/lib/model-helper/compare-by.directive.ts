import { Directive, ElementRef, Renderer2, Optional, Host, Input, forwardRef } from '@angular/core';
import { SelectControlValueAccessor, NgSelectOption, NG_VALUE_ACCESSOR } from "@angular/forms";

@Directive({
  selector: '[ngModel][compareBy]',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CompareByDirective),
    multi: true,
  }],
  host: {
    '(change)': 'onChange($event.target.value)', 
    '(blur)': 'onTouched()'
  },
})
export class CompareByDirective extends SelectControlValueAccessor {

  @Input() 
  set compareBy(prop: string) {
    // hack to access private property
    this['_compareWith'] = (o1: any, o2: any) => {
      return o1 && o2 ? o1[prop] === o2[prop] : o1 === o2;
    };
  }
}

@Directive({selector: 'option'})
export class CompareBySelectOption extends NgSelectOption {

  constructor(
    _element: ElementRef, 
    _renderer: Renderer2,
    @Optional() @Host() _select: CompareByDirective) {
      super(_element, _renderer, _select);
  }
}