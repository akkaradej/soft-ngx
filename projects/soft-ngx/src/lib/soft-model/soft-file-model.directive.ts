import {
  Directive, ElementRef,
  Input, Output, EventEmitter, HostListener,
} from '@angular/core';

import {
  NG_VALIDATORS, Validator, AbstractControl, ValidationErrors,
  ControlValueAccessor, NG_VALUE_ACCESSOR
} from '@angular/forms';

@Directive({
    selector: 'input[type="file"][ngModel][softFileModel]',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: SoftFileModelDirective,
            multi: true,
        },
        {
            provide: NG_VALIDATORS,
            useExisting: SoftFileModelDirective,
            multi: true,
        },
    ],
    standalone: false
})
export class SoftFileModelDirective implements ControlValueAccessor, Validator {

  @HostListener('change', ['$event.target.files'])
  onHostChange(files: FileList) {
    if (this.loaded.observers.length > 0) {
      this.load(files);
    }
    this.onChange(this.getInputValue(files));
    if (this.autoClear) {
      this.clear();
    }
    this.onBlur({});
  }

  /*
   * validate max size in MB
   */
  @Input() maxSize: number;
  @Input() autoClear = false;

  @Output() loaded = new EventEmitter<string | { dataUrl: string, index: number }[]>();

  disabled = false;

  constructor(
    private element: ElementRef<HTMLInputElement>) {
  }

  writeValue(value: any): void {
    if (!value) {
      this.clear();
    }
  }

  onBlur(event) {
    this.onTouched(event);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  validate(control: AbstractControl): ValidationErrors {
    // valid for empty value
    if (control.value == null || control.value === '') {
      return null;
    }
    // validate max size
    if (this.maxSize && this.overMaxSize(control.value)) {
      return { maxSize: true };
    }
    return null;
  }

  private overMaxSize(value: File | FileList | undefined | any): boolean {
    if (this.maxSize && value) {
      const maxSizeByte = this.maxSize * 1024 * 1024;
      if (this.element.nativeElement.hasAttribute('multiple')) {
        for (let i = 0; i < value['length']; i++) {
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

  private getInputValue(files: FileList): File | FileList | undefined {
    if (this.element.nativeElement.hasAttribute('multiple')) {
      return files;
    }
    return files[0];
  }

  private load(files: FileList) {
    if (this.element.nativeElement.hasAttribute('multiple')) {
      for (let i = 0; i < files.length; i++) {
        ((index) => {
          const reader = new FileReader();
          reader.onload = (event: any) => {
            this.loaded.emit([event.target.result, index]);
          };
          reader.readAsDataURL(files[index]);
        })(i);
      }
    } else {
      if (files[0]) {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          this.loaded.emit(event.target.result);
        };
        reader.readAsDataURL(files[0]);
      } else {
        this.loaded.emit(undefined);
      }
    }
  }

  private clear() {
    this.element.nativeElement.value = '';
    if (this.element.nativeElement.value) {
      this.element.nativeElement.type = 'text';
      this.element.nativeElement.type = 'file';
    }
  }

  private onChange = (_: any) => { };
  private onTouched = (_: any) => { };
}
