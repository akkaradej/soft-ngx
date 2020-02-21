export interface SoftUIStateConfig {
  // Delay before start busy state. It will not start if promise/subscription resolve before delay.
  busyDelay?: number;
  busyText?: string;
}

export const defaultConfig: SoftUIStateConfig = {
  busyDelay: 400,
  busyText: 'Please wait...',
};
