import { OnInit, OnDestroy, OnChanges, Directive, ElementRef, SimpleChanges, 
  Input, Output, EventEmitter } from '@angular/core';

import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';

export type HTMLFileInputAttribute = any | boolean;
interface FileInputEventTarget extends EventTarget {
  files: FileList;
}

@Directive({
  selector:  'input[type="file"][fileModel][ngModel]',
  exportAs:  'fileModelDirective',
  providers: [
    {
      provide:     NG_VALIDATORS,
      useExisting: FileModelDirective,
      multi:       true
    }
  ],
  host: {
    '(change)': 'onChange($event.target)'
  }
})
export class FileModelDirective implements Validator {

  private _isFirstRequired: boolean = true;
  private _control: AbstractControl;

  @Input() fileModel: any;
  @Output() fileModelChange = new EventEmitter();

  /*
   * validate max size in MB
   */
  @Input() maxSize: number;

  _required: boolean = false;
  @Input()
  set required(value: boolean) {
    this._required = value;
    if (!this._isFirstRequired) {
      this._setValidity(this._getInputValue(this._element.nativeElement as FileInputEventTarget));
    }
    this._isFirstRequired = false;
  }
  get required(): boolean {
    return this._required;
  };

  constructor(
    private _element: ElementRef) {
  }

  validate(control: AbstractControl): ValidationErrors {
    if (! this._control) {
      this._control = control;
    }

    return {
      required: { valid: !this._hasError(this._control.value) }
    } as ValidationErrors;
  }

  onChange(eventTarget: EventTarget): void {
    const value: File|FileList|undefined = this._getInputValue(eventTarget as FileInputEventTarget);
    console.log(value);
    this.fileModelChange.emit(value);
    this._setValidity(value);
  }

  private _setValidity(value: File|FileList|undefined): void {
    const errors: ValidationErrors = Object.assign({}, this._control.errors);

    if (this._hasError(value)) {
      errors.required = { valid: false };
    } else {
      if (this._control.hasError('required')) {
        delete errors.required;
      }
    }

    this._control.setErrors(Object.keys(errors).length ? errors : null);
  }

  private _hasError(value: File|FileList|undefined): boolean {
    return (this.required && !this._hasValue(value)) || this.overMaxSize(value);
  }

  private _hasValue(value: File|FileList|undefined): boolean {
    if (this._element.nativeElement.hasAttribute('multiple')) {
      return value instanceof FileList && !!value.length;
    }
    return value instanceof File;
  };

  private overMaxSize(value: File|FileList|undefined|any): boolean {
    if (this.maxSize && value) {
      const maxSizeByte = this.maxSize * 1024 * 1024;
      if (this._element.nativeElement.hasAttribute('multiple')) {
        for (let i=0; i<value['length']; i++) {
          if (value[i].size > maxSizeByte) {
            return true;
          }
        }
      } else {
        if (value['size'] > maxSizeByte) {
          return true;
        }
      }
    }
    return false;
  }

  private _getInputValue(eventTarget: FileInputEventTarget): File|FileList|undefined {
    if (this._element.nativeElement.hasAttribute('multiple')) {
      return eventTarget.files;
    }
    return eventTarget.files[0];
  }

}