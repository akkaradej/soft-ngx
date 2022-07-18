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
    return this.requestHelper('Get', url, { body: undefined, params, headers }, isPublic).pipe(
      this.httpErrorHandler(),
    );
  }

  post(url: string, body: any, params?: Params, headers?: HttpHeaders, isPublic?: boolean): Observable<any> {
    return this.requestHelper('Post', url, { body, params, headers }, isPublic).pipe(
      this.httpErrorHandler(),
    );
  }

  put(url: string, body: any, params?: Params, headers?: HttpHeaders, isPublic?: boolean): Observable<any> {
    return this.requestHelper('Put', url, { body, params, headers }, isPublic).pipe(
      this.httpErrorHandler(),
    );
  }

  delete(url: string, params?: Params, headers?: HttpHeaders, isPublic?: boolean): Observable<any> {
    return this.requestHelper('Delete', url, { params, headers }, isPublic).pipe(
      this.httpErrorHandler(),
    );
  }

  blobGet(url: string, params?: Params, headers?: HttpHeaders, isPublic?: boolean): Observable<any> {
    return this.requestHelper('Get', url, { body: undefined, params, headers, responseType: 'blob' }, isPublic).pipe(
      this.httpErrorHandler(),
    );
  }

  blobPost(url: string, body: any, params?: Params, headers?: HttpHeaders, isPublic?: boolean): Observable<any> {
    return this.requestHelper('Post', url, { body, params, headers, responseType: 'blob' }, isPublic).pipe(
      this.httpErrorHandler(),
    );
  }

  multipartPost(url: string, body: any, params?: Params, headers?: HttpHeaders, isPublic?: boolean): Observable<any> {
    const formData = new FormData();
    for (const [key, value] of Object.entries(body)) {
      if (value !== undefined) {
        formData.append(key, value as any);
      }
    }
    return this.post(url, formData, params, headers, isPublic);
  }

  multipartPut(url: string, body: any, params?: Params, headers?: HttpHeaders, isPublic?: boolean): Observable<any> {
    const formData = new FormData();
    for (const [key, value] of Object.entries(body)) {
      if (value !== undefined) {
        formData.append(key, body[key]);
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
      return throwError(err);
    });
  }

  private requestHelper(
    method: string, url: string, options: HttpClientRequestOptions, isPublic?: boolean): Observable<Response> {
    url = `${this.config.apiBaseUrl}${url}`;

    if (!options.responseType) {
      options.responseType = 'text'; // want to manual parsing json
    }

    if (!options.observe) {
      options.observe = 'response'; // need whole response
    }

    if (options.params) {
      // remove url params with undefined
      options.params = Object.getOwnPropertyNames(options.params)
        .filter((propName: string) => options.params![propName] !== undefined)
        .reduce((acc, cur) => {
          acc[cur] = options.params![cur];
          return acc;
        }, {} as { [key: string]: string });
    }

    return this.execute(method, url, options, isPublic);
  }

  private execute(method: string, url: string, options: HttpClientRequestOptions, isPublic?: boolean): Observable<Response> {
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
    const formattedHeaders = [];
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
}
