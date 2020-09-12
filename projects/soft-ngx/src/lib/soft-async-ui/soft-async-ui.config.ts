export interface SoftAsyncUIConfig {
  busyDelay?: number;
  busyContainerMinHeight?: number;
  minDuration?: number;
}

export const defaultConfig: SoftAsyncUIConfig = {
  busyDelay: 400,
  busyContainerMinHeight: 50,
};
