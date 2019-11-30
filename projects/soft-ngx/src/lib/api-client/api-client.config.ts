import { ApiErrorHandler } from './api-error.model';

export interface ApiClientConfig {
  apiBaseUrl?: string;
  pageHeaderResponseKeys?: {
    pageCount: string;
    totalCount: string;
  };
  dateReviver?: (key: string, value: string) => string | Date;
  errorHandler?: (err) => ApiErrorHandler;
}

export const defaultConfig = {
  apiBaseUrl: '',
  pageHeaderResponseKeys: {
    pageCount: 'X-PageCount',
    totalCount: 'X-TotalCount'
  },
  useDateRequestInterceptor: true,
  useNoCacheInterceptor: true
};
