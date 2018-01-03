export interface BusyConfig {
  // Delay before start busy state. It will not start if promise/subscription resolve before delay.
  busyDelay?: number;
}

export const defaultConfig: BusyConfig = {
  busyDelay: 400
};