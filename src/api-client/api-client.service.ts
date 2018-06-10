import { Injectable, Inject, InjectionToken } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';

import { Observable, Observer, throwError, of, empty } from 'rxjs';
import { catchError, delay, map, mergeMap, retryWhen, tap } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';
import { PopupService } from '../popup/popup.service';
import { WindowClass, windowToken } from '../window';

import { ApiClientConfig, defaultConfig } from './api-client.config';
import { ApiError } from './api-error.model';

import { userConfigToken } from './user-config.token';
import { readdir } from 'fs';

export type HttpMethod = 'get' | 'post';

export interface Params {
  [param: string]: any;
}

export interface HeaderResponse {
  pageCount?: number,
  pageTotal?: number,
  [key: string]: any
}

interface HttpClientRequestOptions {
  body?: any;
  headers?: HttpHeaders | {
    [header: string]: string | string[];
  };
  observe?: 'body' | 'response';
  params?: HttpParams | {
    [param: string]: string | string[];
  };
  reportProgress?: boolean;
  responseType?: 'text';
  withCredentials?: boolean;
}

@Injectable()
export class ApiClientService {

  private config = {} as ApiClientConfig;

  constructor(
    @Inject(userConfigToken) userConfig: ApiClientConfig,
    @Inject(windowToken) private window: WindowClass,
    private authService: AuthService,
    private http: HttpClient,
    private popupService: PopupService) {

    this.config = Object.assign({}, defaultConfig, userConfig);
    if (!this.config.apiBaseUrl) {
      throw new TypeError('ApiClientConfig is needed to set apiBaseUrl');
    }
  }

  public getBaseUrl() {
    return this.config.apiBaseUrl;
  }

  public request(httpMethod: HttpMethod, url: string, options: HttpClientRequestOptions, isPublic?: boolean, headerResponse?: HeaderResponse): Observable<any> {
    if (httpMethod.toLowerCase() == 'get') {
      return this.get(url, options.params, isPublic, headerResponse);
    } else if (httpMethod.toLowerCase() == 'post') {
      return this.post(url, options.body, options.params, isPublic, headerResponse);
    } else if (httpMethod.toLowerCase() == 'put') {
      return this.put(url, options.body, options.params, isPublic, headerResponse);
    } else if (httpMethod.toLowerCase() == 'delete') {
      return this.delete(url, options.params, isPublic, headerResponse);
    }
    return of();
  }

  public get(url: string, params: Params = {}, isPublic?: boolean, headerResponse?: HeaderResponse): Observable<any> {
    let isPaging: boolean = params.page !== undefined;

    let req = this.requestHelper('Get', url, { body: undefined, params }, isPublic, headerResponse).pipe(
      // retry againg if server error
      retryWhen((errors) => {
        let count = 0;
        return errors.pipe(
          mergeMap(error => {
            count++;
            if (count < 2 && error.status >= 500) {
              return of(error);
            }
            return throwError(error);
          }),
          delay(500)
        )
      })
    );

    // auto set page totalCount from header
    if (isPaging) {
      req = req.pipe(
        tap((res: any) => {
          if (headerResponse !== undefined && this.config.pageHeaderResponseKeys) {
            headerResponse.pageCount = headerResponse[this.config.pageHeaderResponseKeys.pageCount];
            headerResponse.totalCount = headerResponse[this.config.pageHeaderResponseKeys.totalCount];
          }
        }),
      );
    }

    return req;
  }

  public post(url: string, body: any, params?: Params, isPublic?: boolean, headerResponse?: HeaderResponse): Observable<any> {
    return this.requestHelper('Post', url, { body, params }, isPublic, headerResponse).pipe(
      this.globalErrorHandler()
    );
  }

  public put(url: string, body: any, params?: Params, isPublic?: boolean, headerResponse?: HeaderResponse): Observable<any> {
    return this.requestHelper('Put', url, { body, params }, isPublic, headerResponse).pipe(
      this.globalErrorHandler()
    );
  }

  public delete(url: string, params?: Params, isPublic?: boolean, headerResponse?: HeaderResponse): Observable<any> {
    return this.requestHelper('Delete', url, { params }, isPublic, headerResponse).pipe(
      this.globalErrorHandler()
    );
  }

  public multipartPost(url: string, body: any, params?: Params, isPublic?: boolean, headerResponse?: HeaderResponse): Observable<any> {
    const formData = new FormData();
    for (let key in body) {
      formData.append(key, body[key]);
    }
    return this.post(url, formData, params, isPublic, headerResponse);
  }

  public multipartPut(url: string, body: any, params?: Params, isPublic?: boolean, headerResponse?: HeaderResponse): Observable<any> {
    const formData = new FormData();
    for (let key in body) {
      formData.append(key, body[key]);
    }
    return this.put(url, formData, params, isPublic, headerResponse);
  }

  private globalErrorHandler() {
    return catchError((err: ApiError) => {
      let message = 'Something wrong, please try again.';
      if (err.error) {
        try {
          const error = JSON.parse(err.error);
          if (error.message) {
            message = error.message;
          }
        } catch (e) {
        }
      }
      const alertTimeout = this.window.setTimeout(() => {
        this.popupService.alert('Cannot Operate', message, 'danger');
      });
      err.ignoreGlobalErrorAlert = () => {
        this.window.clearTimeout(alertTimeout);
      };
      return throwError(err);
    })
  }

  private requestHelper(method: string, url: string, options: HttpClientRequestOptions, isPublic?: boolean, headerResponse?: HeaderResponse): Observable<Response> {
    url = `${this.config.apiBaseUrl}/${url}`;
    options.responseType = 'text'; // want to manual parsing json
    if (headerResponse !== undefined) {
      options.observe = 'response';
    } else {
      options.observe = 'body';
    }
    return this.execute(method, url, options, isPublic).pipe(
      map((res: any) => {
        if (headerResponse !== undefined) {
          const keys = Object.keys(headerResponse);
          for (let key of keys) {
            let value = res.headers.get(key);
            // auto check and convert to expected type
            if (value) {
              if (isNaN(value)) {
                if (value == 'true')
                  value = true
                else if (value == 'false')
                  value = false
              } else {
                value = +value;
              }
            }
            headerResponse[key] = value;
          }
          return res.data;
        }
        return res;
      })
    );
  }

  private execute(method: string, url: string, options: HttpClientRequestOptions, isPublic?: boolean): Observable<Response> {
    if (!isPublic) {
      if (this.authService.isLoggedIn) {
        // add Authorization header
        let scheme = '';
        if (this.authService.authenticationScheme) {
          scheme = this.authService.authenticationScheme + ' ';
        }
        options.headers = new HttpHeaders().set('Authorization', scheme + this.authService.getAccessToken());
      } else {
        // refresh token
        return this.authService.refreshToken().pipe(
          mergeMap(refreshSuccess => {
            if (refreshSuccess) {
              return this.execute(method, url, options);
            }
            return empty();
          })
        );
      }
    }

    return this.http.request(method, url, options).pipe(
      catchError(err => {
        if (err.status == 401) {
          if (typeof this.authService.refreshToken == 'function') {
            return this.authService.refreshToken().pipe(
              mergeMap(refreshSuccess => {
                if (refreshSuccess) {
                  return this.execute(method, url, options);
                }
                return empty();
              })
            );
          }
          return empty();
        }
        return throwError(err);
      }),
      map(res => {
        if (options.observe == 'response') {
          return {
            headers: res.headers,
            data: this.formatResponse(res.body)
          }
        } else {
          return this.formatResponse(res);
        }
      })
    );
  }

  private formatResponse(body: any) {
    if (body !== '') {
      try {
        return JSON.parse(body, this.dateReviver);
      } catch (error) {
        console.error('json is invalid');
      }
    }
    return '';
  }

  private dateReviver(key: string, value: string) {
    var a;
    if (typeof value == 'string' && value.length == 20) {
      a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
      if (a) {
        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]));
      }
    }
    return value;
  };
}