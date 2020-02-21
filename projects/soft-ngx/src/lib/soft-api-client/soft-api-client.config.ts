import { SoftApiErrorHandler } from './soft-api-error.model';

export interface SoftApiClientConfig {
  apiBaseUrl?: string;
  pageHeaderResponseKeys?: {
    pageCount: string;
    totalCount: string;
  };
  dateRequestFormatter?: (date: Date) => string;
  dateResponseReviver?: (key: string, value: string) => string | Date;
  errorHandler?: (err) => SoftApiErrorHandler;
}

export const defaultConfig = {
  apiBaseUrl: '',
  pageHeaderResponseKeys: {
    pageCount: 'X-PageCount',
    totalCount: 'X-TotalCount',
  },
  useDateRequestInterceptor: true,
  useNoCacheInterceptor: true,
};
