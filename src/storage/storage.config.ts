export interface StorageConfig {
  storagePrefix?: string;
  storageType?: Storage;
}

export const defaultConfig = {
  storagePrefix: '',
  storageType: window.localStorage,
};
