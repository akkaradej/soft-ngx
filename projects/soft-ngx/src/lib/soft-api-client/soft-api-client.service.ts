import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';

import { Observable, throwError, of, OperatorFunction } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { SoftApiClientConfig, defaultConfig } from './soft-api-client.config';
import { SoftApiError } from './soft-api-error.model';

import { userSoftApiClientConfigToken } from './user-config.token';
import { SoftApiErrorHandlerService } from './soft-api-error-handler.service';

export type HttpMethod = 'get' | 'post' | 'put' | 'delete';

export interface Params {
  [param: string]: any;
}

export interface HttpClientRequestOptions {
  body?: any;
  headers?: HttpHeaders;
  observe?: 'body' | 'response' | 'events';
  params?: {
    [param: string]: string;
  };
  reportProgress?: boolean;
  responseType?: 'text' | 'blob';
  withCredentials?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class SoftApiClientService {

  config = {} as SoftApiClientConfig;

  constructor(
    protected http: HttpClient,
    protected apiErrorHandlerService: SoftApiErrorHandlerService,
    @Inject(userSoftApiClientConfigToken) userConfig: SoftApiClientConfig,
  ) {
    this.config = Object.assign({}, defaultConfig, userConfig);
  }

  request(
    httpMethod: HttpMethod, url: string, options: HttpClientRequestOptions,
    isPublic?: boolean): Observable<any> {
    if (httpMethod.toLowerCase() === 'get') {
      return this.get(url, options.params, options.headers, isPublic);
    } else if (httpMethod.toLowerCase() === 'post') {
      return this.post(url, options.body, options.params, options.headers, isPublic);
    } else if (httpMethod.toLowerCase() === 'put') {
      return this.put(url, options.body, options.params, options.headers, isPublic);
    } else if (httpMethod.toLowerCase() === 'delete') {
      return this.delete(url, options.params, options.headers, isPublic);
    }
    return of(null);
  }

  get(url: string, params: Params = {}, headers?: HttpHeaders, isPublic?: boolean): Observable<any> {
    return this.requestHelper('get', url, { body: undefined, params, headers }, isPublic).pipe(
      this.httpErrorHandler(),
    );
  }

  post(url: string, body: any, params?: Params, headers?: HttpHeaders, isPublic?: boolean): Observable<any> {
    return this.requestHelper('post', url, { body, params, headers }, isPublic).pipe(
      this.httpErrorHandler(),
    );
  }

  put(url: string, body: any, params?: Params, headers?: HttpHeaders, isPublic?: boolean): Observable<any> {
    return this.requestHelper('put', url, { body, params, headers }, isPublic).pipe(
      this.httpErrorHandler(),
    );
  }

  delete(url: string, params?: Params, headers?: HttpHeaders, isPublic?: boolean): Observable<any> {
    return this.requestHelper('delete', url, { params, headers }, isPublic).pipe(
      this.httpErrorHandler(),
    );
  }

  blobGet(url: string, params?: Params, headers?: HttpHeaders, isPublic?: boolean): Observable<any> {
    return this.requestHelper('get', url, { body: undefined, params, headers, responseType: 'blob' }, isPublic).pipe(
      this.httpErrorHandler(),
    );
  }

  blobPost(url: string, body: any, params?: Params, headers?: HttpHeaders, isPublic?: boolean): Observable<any> {
    return this.requestHelper('post', url, { body, params, headers, responseType: 'blob' }, isPublic).pipe(
      this.httpErrorHandler(),
    );
  }

  multipartPost(url: string, body: any, params?: Params, headers?: HttpHeaders, isPublic?: boolean): Observable<any> {
    const formData = new FormData();
    for (const [key, value] of Object.entries(body)) {
      if (value !== undefined) {
        if (value instanceof FileList) {
          for (let i = 0; i < value.length; i++) {
            formData.append(key, value.item(i));
          }
        } else if (Array.isArray(value)) {
          for (const obj of value) {
            formData.append(key, obj);
          }
        } else {
          formData.append(key, value as any);
        }
      }
    }
    return this.post(url, formData, params, headers, isPublic);
  }

  multipartPut(url: string, body: any, params?: Params, headers?: HttpHeaders, isPublic?: boolean): Observable<any> {
    const formData = new FormData();
    for (const [key, value] of Object.entries(body)) {
      if (value !== undefined) {
        if (value instanceof FileList) {
          for (let i = 0; i < value.length; i++) {
            formData.append(key, value.item(i));
          }
        } else if (Array.isArray(value)) {
          for (const obj of value) {
            formData.append(key, obj);
          }
        } else {
          formData.append(key, value as any);
        }
      }
    }
    return this.put(url, formData, params, headers, isPublic);
  }

  private httpErrorHandler(): OperatorFunction<any, any> {
    return catchError((err: SoftApiError) => {
      const handlerTimeout = window.setTimeout(() => {
        this.apiErrorHandlerService.handleError(err);
      });
      err.ignoreErrorHandler = () => {
        window.clearTimeout(handlerTimeout);
      };
      this.apiErrorHandlerService.forceHandleError(err);
      return throwError(() => err);
    });
  }

  private requestHelper(
    method: HttpMethod, url: string, options: HttpClientRequestOptions, isPublic?: boolean): Observable<any> {
    url = `${this.config.apiBaseUrl}${url}`;

    if (!options.responseType) {
      options.responseType = 'text'; // want to manual parsing json
    }

    if (!options.observe) {
      options.observe = 'response'; // need whole response
    }

    this.formatRequest(method, options);
    return this.execute(method, url, options, isPublic);
  }

  private execute(method: string, url: string, options: HttpClientRequestOptions, isPublic?: boolean): Observable<any> {
    if (!isPublic) {
      options.headers = options.headers || new HttpHeaders();
      if (!options.headers.has('Authorization')) {
        options.headers = options.headers.set('Authorization', 'ACCESS_TOKEN');
      }
    }

    return this.http.request(method, url, options).pipe(
      map(res => {
        if (options.observe === 'response') {
          return {
            headers: this.formatResponseHeader(res.headers),
            data: options.responseType === 'text' ? this.formatResponse(res.body) : res.body,
          };
        } else if (options.observe === 'body') {
          return options.responseType === 'text' ? this.formatResponse(res) : res;
        } else if (options.reportProgress) {
          if (res.type === HttpEventType.UploadProgress) {
            var eventTotal = res.total ? res.total : 0;
            return {
              progress: Math.round(res.loaded / eventTotal * 100),
              data: undefined,
            }
          }
          if (res.type === HttpEventType.Response) {
            return {
              progress: 100,
              data: options.responseType === 'text' ? this.formatResponse(res.body) : res.body,
            }
          }
          return {
            progress: 0,
            data: undefined,
          }
        } else {
          return res;
        }
      }),
    );
  }

  private formatRequest(method: HttpMethod, options: HttpClientRequestOptions) {
    if (options.params) {
      options.params = Object.getOwnPropertyNames(options.params)
        // remove url params with undefined
        .filter((propName: string) => options.params![propName] !== undefined)
        .reduce((acc, cur) => {
          const obj = options.params![cur] as any;
          if (obj instanceof Date) {
            // format date request params
            if (this.config.dateRequestFormatter) {
              acc[cur] = this.config.dateRequestFormatter(obj);
            } else {
              acc[cur] = obj.toISOString();
            }
          } else {
            acc[cur] = options.params![cur];
          }
          return acc;
        }, {} as { [key: string]: string });
    }
    // body
    if (method === 'post' || method === 'put') {
      if (options.body && !(options.body instanceof FormData) && options.responseType !== 'blob') {
        options.body = this.iterateFormatDate(options.body);
      }
    }
  }

  private formatResponse(body: any) {
    if (body !== '') {
      try {
        return JSON.parse(body, this.config.dateResponseReviver);
      } catch (error) {
        return body;
      }
    }
    return '';
  }

  private formatResponseHeader(headers: HttpHeaders) {
    const formattedHeaders: { [key: string]: any }[] = [];
    const keys = headers.keys();
    for (const key of keys) {
      let value: any = headers.get(key);
      // auto convert type
      if (value) {
        if (isNaN(value)) {
          if (value === 'true') {
            value = true;
          } else if (value === 'false') {
            value = false;
          }
        } else {
          value = +value;
        }
      }
      formattedHeaders[key.toLowerCase()] = value;
    }
    return formattedHeaders;
  }

  private iterateFormatDate(obj) {
    let newObj;
    if (Array.isArray(obj)) {
      newObj = [];
    } else {
      newObj = {};
    }
    Object.keys(obj).forEach(key => {
      if (obj[key] instanceof Date) {
        newObj[key] = this.config.dateRequestFormatter(obj[key]);
      } else if (typeof obj[key] === 'object' && !(obj[key] instanceof FormData) && obj[key]) {
        newObj[key] = this.iterateFormatDate(obj[key]);
      } else {
        newObj[key] = obj[key];
      }
    });
    return newObj;
  }
}
