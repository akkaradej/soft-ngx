import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, throwError, of, OperatorFunction } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { SoftApiClientConfig, defaultConfig } from './soft-api-client.config';
import { SoftApiError } from './soft-api-error.model';

import { userSoftApiClientConfigToken } from './user-config.token';
import { SoftApiErrorHandlerService } from './soft-api-error-handler.service';

export type HttpMethod = 'get' | 'post' | 'put' | 'delete';

export interface Params {
  [param: string]: any;
}

export interface HeaderResponse {
  [key: string]: any;
}

export interface HttpClientRequestOptions {
  body?: any;
  headers?: HttpHeaders;
  observe?: 'body' | 'response';
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

  public request(
    httpMethod: HttpMethod, url: string, options: HttpClientRequestOptions,
    isPublic?: boolean, headerResponse?: HeaderResponse): Observable<any> {
    if (httpMethod.toLowerCase() === 'get') {
      return this.get(url, options.params, isPublic, headerResponse);
    } else if (httpMethod.toLowerCase() === 'post') {
      return this.post(url, options.body, options.params, isPublic, headerResponse);
    } else if (httpMethod.toLowerCase() === 'put') {
      return this.put(url, options.body, options.params, isPublic, headerResponse);
    } else if (httpMethod.toLowerCase() === 'delete') {
      return this.delete(url, options.params, isPublic, headerResponse);
    }
    return of();
  }

  public get(url: string, params: Params = {}, isPublic?: boolean, headerResponse?: HeaderResponse): Observable<any> {
    const isPaging: boolean = params.page != null;

    let req = this.requestHelper('Get', url, { body: undefined, params }, isPublic, headerResponse).pipe(
      // retry againg if server error
      // retryWhen((errors) => {
      //   let count = 0;
      //   return errors.pipe(
      //     mergeMap(error => {
      //       count++;
      //       if (count < 2 && error.status >= 500) {
      //         return of(error);
      //       }
      //       return throwError(error);
      //     }),
      //     delay(500)
      //   );
      // }),
      this.httpErrorHandler(),
    );

    // auto set page totalCount from header
    if (isPaging) {
      req = req.pipe(
        mergeMap((res: any) => {
          if (headerResponse && this.config.pageHeaderResponseKeys) {
            headerResponse.pageCount = headerResponse[this.config.pageHeaderResponseKeys.pageCount.toLowerCase()];
            headerResponse.totalCount = headerResponse[this.config.pageHeaderResponseKeys.totalCount.toLowerCase()];
          }
          return of(res);
        }),
      );
    }

    return req;
  }

  public post(url: string, body: any, params?: Params, isPublic?: boolean, headerResponse?: HeaderResponse): Observable<any> {
    return this.requestHelper('Post', url, { body, params }, isPublic, headerResponse).pipe(
      this.httpErrorHandler(),
    );
  }

  public put(url: string, body: any, params?: Params, isPublic?: boolean, headerResponse?: HeaderResponse): Observable<any> {
    return this.requestHelper('Put', url, { body, params }, isPublic, headerResponse).pipe(
      this.httpErrorHandler(),
    );
  }

  public delete(url: string, params?: Params, isPublic?: boolean, headerResponse?: HeaderResponse): Observable<any> {
    return this.requestHelper('Delete', url, { params }, isPublic, headerResponse).pipe(
      this.httpErrorHandler(),
    );
  }

  public blobGet(url: string, params?: Params, isPublic?: boolean, headerResponse?: HeaderResponse): Observable<any> {
    return this.requestHelper('Get', url, { body: undefined, params, responseType: 'blob' }, isPublic, headerResponse).pipe(
      this.httpErrorHandler(),
    );
  }

  public blobPost(url: string, body: any, params?: Params, isPublic?: boolean, headerResponse?: HeaderResponse): Observable<any> {
    return this.requestHelper('Post', url, { body, params, responseType: 'blob' }, isPublic, headerResponse).pipe(
      this.httpErrorHandler(),
    );
  }

  public multipartPost(url: string, body: any, params?: Params, isPublic?: boolean, headerResponse?: HeaderResponse): Observable<any> {
    const formData = new FormData();
    for (const [key, value] of Object.entries(body)) {
      if (value !== undefined) {
        formData.append(key, value as any);
      }
    }
    return this.post(url, formData, params, isPublic, headerResponse);
  }

  public multipartPut(url: string, body: any, params?: Params, isPublic?: boolean, headerResponse?: HeaderResponse): Observable<any> {
    const formData = new FormData();
    for (const [key, value] of Object.entries(body)) {
      if (value !== undefined) {
        formData.append(key, body[key]);
      }
    }
    return this.put(url, formData, params, isPublic, headerResponse);
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
    method: string, url: string, options: HttpClientRequestOptions,
    isPublic?: boolean, headerResponse?: HeaderResponse): Observable<Response> {
    url = `${this.config.apiBaseUrl}${url}`;

    if (!options.responseType) {
      options.responseType = 'text'; // want to manual parsing json
    }

    if (!options.observe) {
      if (!headerResponse) {
        options.observe = 'body'; // need only body
      } else {
        options.observe = 'response'; // need whole response
      }
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

    return this.execute(method, url, options, isPublic).pipe(
      map((res: any) => {
        if (headerResponse) {
          const keys = res.headers.keys();
          for (const key of keys) {
            let value = res.headers.get(key);
            // auto check and convert to expected type
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
            headerResponse[key.toLowerCase()] = value;
          }
          return res.data;
        }
        return res;
      }),
    );
  }

  private execute(method: string, url: string, options: HttpClientRequestOptions, isPublic?: boolean): Observable<Response> {
    if (!isPublic) {
      options.headers = options.headers || new HttpHeaders();
      options.headers = options.headers.set('Authorization', 'ACCESS_TOKEN_IS_NEEDED');
    }

    return this.http.request(method, url, options).pipe(
      catchError(err => {
        return throwError(err);
      }),
      map(res => {
        if (options.observe === 'response') {
          return {
            headers: res.headers,
            data: options.responseType === 'text' ? this.formatResponse(res.body) : res.body,
          };
        } else {
          return options.responseType === 'text' ? this.formatResponse(res) : res;
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
}
