import { Type } from '@angular/core';

export interface SoftAsyncUIConfig {
  busyDelay?: number;
  busyContainerMinHeight?: number;
  minDuration?: number;
}

export interface SoftSkeletonType {
  [key: string]: Type<any>;
}

export const defaultConfig: SoftAsyncUIConfig = {
  busyDelay: 400,
  busyContainerMinHeight: 50,
};
