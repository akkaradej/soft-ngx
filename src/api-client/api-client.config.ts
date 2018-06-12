export interface ApiClientConfig {
  apiBaseUrl: string;
  pageHeaderResponseKeys?: {
    pageCount: string;
    totalCount: string;
  }
}

export const defaultConfig = {
  pageHeaderResponseKeys: {
    pageCount: 'X-PageCount',
    totalCount: 'X-TotalCount'
  }
};
