import { Injectable, InjectionToken } from '@angular/core';

@Injectable()
export class WindowClass extends Window {
}

export const windowToken = new InjectionToken('windowToken');

export function getWindow(): Window { return window; }
