export interface ApiClientConfig {
  apiBaseUrl: string;
  authApiUrl: string;
  authAdditionalData?: string[];
  loginScreenUrl?: string;
  storagePrefix?: string;
  storageType?: Storage;
}

export const defaultConfig = {
  authAdditionalData: <string[]>[],
  loginScreenUrl: '/',
  storagePrefix: '',
  storageType: window.localStorage
};
