import { HttpErrorResponse } from "@angular/common/http";

export interface SoftApiClientConfig {
  apiBaseUrl?: string;
  pageHeaderResponseKeys?: {
    pageCount: string;
    totalCount: string;
  };
  dateRequestFormatter?: (date: Date) => string;
  dateResponseReviver?: (key: string, value: string) => string | Date;
}

export const defaultConfig = {
  apiBaseUrl: '',
  pageHeaderResponseKeys: {
    pageCount: 'X-PageCount',
    totalCount: 'X-TotalCount',
  },
  dateRequestFormatter: (date: Date) => { 
    return date.toISOString(); 
  },
  dateResponseReviver: (key: string, value: string) => {
    let a;
    if (typeof value === 'string' && value.length === 20) {
      a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
      if (a) {
        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]));
      }
    }
    return value;
  },
};
