export interface StorageConfig {
  storagePrefix?: string;
  usePersistentAsDefault?: boolean;
  persistentStorage?: Storage,
  temporaryStorage?: Storage
}

export const defaultConfig = {
  storagePrefix: '',
  usePersistentAsDefault: true,
  persistentStorage: window.localStorage,
  temporaryStorage: window.sessionStorage
};
