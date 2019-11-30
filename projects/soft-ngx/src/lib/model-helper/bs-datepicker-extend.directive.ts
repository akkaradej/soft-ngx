import { Directive, OnInit, Inject, Input, Output, EventEmitter, forwardRef, Renderer2, ElementRef, Optional } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, ValidationErrors, Validator } from '@angular/forms';

import * as momentjs from 'moment';
const moment = (momentjs as any).default || momentjs;

import { WindowClass, windowToken } from '../window';

// ----------- Compatible with Ngx-bootstrap 2.0.0-beta5 --------------------//

export interface BsDatepickerExtendOptions {
  time?: 'StartOfDay' | 'EndOfDay' | 'Current' | null;
}

@Directive({
  selector: '[bsDatepickerExtend]',
  host: {
    '(bsValueChange)': 'onChange($event)',
  }
})
export class BsDatepickerExtendDirective implements OnInit {

  @Input() bsValue: any;
  @Input() bsDatepickerExtend: any;
  @Output() ngModelChange: EventEmitter<any> = new EventEmitter();

  isInit = false;

  date: momentjs.Moment;
  options: BsDatepickerExtendOptions = {
    time: 'Current'
  };

  constructor(
    private _renderer: Renderer2,
    private _elementRef: ElementRef,
    @Inject(windowToken) protected _window: WindowClass) {
  }

  ngOnInit() {
    this.isInit = true;
    if (this.bsDatepickerExtend) {
      Object.assign(this.options, this.bsDatepickerExtend);
    }
    if (this.bsValue) {
      this.onChange(this.bsValue);
    }
  }

  onChange(value: any): void {
    if (!this.isInit) {
      return;
    }

    if (value && moment(value).isValid()) {
      // Set date variable
      if (!this.date) {
        this.date = this.convertTime(moment(value));
      }

      // Convert time
      if (!this.date.isSame(moment(value))) {
        this.date = this.convertTime(moment(value));
        this._window.setTimeout(() => {
          this.ngModelChange.emit(this.date.toDate());
        });
        return;
      }

    }
  }

  private convertTime(date: momentjs.Moment) {
    if (this.options.time === 'Current') {
      date.hour(moment().get('hour'));
      date.minute(moment().get('minute'));
    } else if (this.options.time === 'StartOfDay') {
      date = date.startOf('day');
    } else if (this.options.time === 'EndOfDay') {
      date = date.endOf('day');
    }
    return date;
  }

}
