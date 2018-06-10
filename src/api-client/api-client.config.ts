export interface ApiClientConfig {
  apiBaseUrl: string;
  authApiUrl: string;
  authAdditionalData?: string[];
  loginScreenUrl?: string;
  storagePrefix?: string;
  storageType?: Storage;
  pageHeaderResponseKeys?: {
    pageCount: string;
    totalCount: string;
  }
}

export const defaultConfig = {
  authAdditionalData: <string[]>[],
  loginScreenUrl: '/',
  storagePrefix: '',
  storageType: window.localStorage,
  pageHeaderResponseKeys: {
    pageCount: 'X-PageCount',
    totalCount: 'X-TotalCount'
  }
};
