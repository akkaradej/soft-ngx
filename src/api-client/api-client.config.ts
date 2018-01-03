export interface ApiClientConfig {
  apiBaseUrl: string;
  authApiUrl: string;
  loginScreenUrl?: string;
  storagePrefix?: string;
  storageType?: Storage;
}

export const defaultConfig = {
  loginScreenUrl: '/',
  storagePrefix: '',
  storageType: window.localStorage
};
