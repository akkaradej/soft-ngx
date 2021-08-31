import { Type } from '@angular/core';

export interface SoftAsyncUIConfig {
  skelDelay?: number;
  skelMinDisplayTime?: number;
  busyDelay?: number;
  busyContainerMinHeight?: number;
  minDuration?: number;
}

export interface SoftSkeletonType {
  [key: string]: Type<any>;
}

export const defaultConfig: SoftAsyncUIConfig = {
  skelDelay: 300,
  skelMinDisplayTime: 400,
  busyDelay: 400,
  busyContainerMinHeight: 50,
};
