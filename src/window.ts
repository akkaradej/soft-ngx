import { Injectable, InjectionToken } from '@angular/core';

@Injectable()
export class WindowClass extends Window {
}

export function getWindow(): Window { return window; }
