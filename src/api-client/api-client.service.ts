import { Injectable, Inject, InjectionToken } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subject } from 'rxjs/Subject';
import { _throw } from 'rxjs/observable/throw';
import { empty } from 'rxjs/observable/empty';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { catchError, delay, map, mergeMap, retryWhen, tap } from 'rxjs/operators';

import { PopupService } from '../popup/popup.service';
import { WindowClass, windowToken } from '../window';

import { ApiClientConfig, defaultConfig } from './api-client.config';
import { ApiError } from './api-error.model';
import { AuthService } from './auth.service';
import { userConfigToken } from './user-config.token';

export interface Params {
  [param: string]: any;
}

export interface GetOptions {
  page?: {
    page: number;
    perPage: number;
    totalCount: number;
  };
  sort?: {
    prop: string;
    dir: string;
  }
}

@Injectable()
export class ApiClientService {
  private config: ApiClientConfig = <ApiClientConfig>{};
  private isRefreshing: boolean = false;
  private refresherStream: Subject<boolean> = new Subject<boolean>();

  constructor(
    @Inject(userConfigToken) userConfig: ApiClientConfig,
    @Inject(windowToken) private window: WindowClass,
    private authService: AuthService,
    private http: HttpClient,
    private popupService: PopupService) {

    this.config = Object.assign({}, defaultConfig, userConfig);
    if (! this.config.apiBaseUrl) {
      throw new TypeError('ApiClientConfig is needed to set apiBaseUrl');
    }
  }

  public getBaseUrl() {
    return this.config.apiBaseUrl;
  }

  public get(url: string, params: Params = {}, opt?: GetOptions, isPublic?: boolean, readHeaderResponse?: boolean): Observable<any> {
    let isPaging: boolean = false;
    if (opt) {
      if (opt.page && opt.page.page && opt.page.perPage) {
        Object.assign(params, {
          page: opt.page.page,
          pageSize: opt.page.perPage
        });
        isPaging = true;
      }

      if (opt.sort && opt.sort.prop) {
        Object.assign(params, {
          orderBy: opt.sort.prop,
          ascending: opt.sort.dir == 'asc'
        });
      }
    }

    let req = this.requestHelper('Get', url, { body: '', params }, isPublic, readHeaderResponse || isPaging).pipe(
      // retry againg if server error
      retryWhen((errors) => {
        let count = 0;
        return errors.pipe(
          mergeMap(error => {
            count++;
            if (count < 2 && error.status >= 500) {
              return of(error);
            }
            return _throw(error);
          }),
          delay(500)
        )
      })
    );

    // auto set page totalCount from header
    if (isPaging) {
      req = req.pipe(
        tap((res: any) => {
          if (opt != null && opt.page != null) {
            opt.page.totalCount = +res.headers.get('X-Paging-TotalRecordCount');
          }
        }),
      );

      if (! readHeaderResponse) {
        req = req.pipe(
          map((res: any) => res.data)
        );
      }
    }

    return req;
  }

  public post(url: string, body: any, params?: Params, isPublic?: boolean, readHeaderResponse?: boolean): Observable<any> {
    return this.requestHelper('Post', url, { body, params }, isPublic, readHeaderResponse).pipe(
      this.globalErrorHandler()
    );
  }

  public put(url: string, body: any, params?: Params, isPublic?: boolean, readHeaderResponse?: boolean): Observable<any> {
    return this.requestHelper('Put', url, { body, params }, isPublic, readHeaderResponse).pipe(
      this.globalErrorHandler()
    );
  }

  public delete(url: string, params?: Params, isPublic?: boolean, readHeaderResponse?: boolean): Observable<any> {
    return this.requestHelper('Delete', url, { body: '', params }, isPublic, readHeaderResponse).pipe(
      this.globalErrorHandler()
    );
  }

  public multipartPost(url: string, body: any, params?: Params, isPublic?: boolean, readHeaderResponse?: boolean): Observable<any> {
    const formData = new FormData();
    for (let key in body) {
      formData.append(key, body[key]);
    }
    return this.post(url, formData, params, isPublic, readHeaderResponse);
  }

  public multipartPut(url: string, body: any, params?: Params, isPublic?: boolean, readHeaderResponse?: boolean): Observable<any> {
    const formData = new FormData();
    for (let key in body) {
      formData.append(key, body[key]);
    }
    return this.put(url, formData, params, isPublic, readHeaderResponse);
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
      return _throw(err);
    })
  }

  private requestHelper(method: string, url: string, options: any, isPublic?: boolean, readHeaderResponse?: boolean): Observable<Response> {
    url = `${this.config.apiBaseUrl}/${url}`;
    options.responseType = 'text'; // manual parsing json
    if (readHeaderResponse) {
      options.observe = 'response';
    } else {
      options.observe = 'body';
    }
    return this.request(method, url, options, isPublic);
  }

  private request(method: string, url: string, options: any, isPublic?: boolean): Observable<Response> {
    if (isPublic) {
      // bypass
    } else if (this.authService.isLoggedIn) {
      options.headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authService.getAccessToken());
    } else {
      return this.refreshToken(method, url, options);
    }

    return this.http.request(method, url, options).pipe(
      catchError(err => {
        if (err.status == 401) {
          return this.refreshToken(method, url, options);
        }
        return _throw(err);
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

  private refreshToken(method: string, url: string, options: any): Observable<any> {
    // if is refreshing token, wait next false value
    if (this.isRefreshing) {
      console.debug('Another request is refreshing token');
      return Observable.create((observer: Observer<boolean>) => {
        this.refresherStream
          .subscribe(isSuccess => {
            console.debug('refresh success:', isSuccess);
            observer.next(isSuccess);
            observer.complete();
          });
      }).pipe(
        mergeMap(isSuccess => {
          console.debug('Another request get refreshed token');
          if (isSuccess) {
            return this.request(method, url, options);
          } else {
            return empty();
          }
        })
        );
    } else {
      console.debug('Start refresh token');
      this.isRefreshing = true;

      return this.authService.refreshToken().pipe(
        catchError(err => {
          console.log(err);
          return of(false);
        }),
        mergeMap(res => {
          console.debug('Finish refresh token');
          this.isRefreshing = false;
          let isSuccess = !!res;
          this.refresherStream.next(isSuccess);
          if (isSuccess) {
            return this.request(method, url, options);
          } else {
            // re-login
            this.window.location.href = this.config.loginScreenUrl || '/';
            return empty();
          }
        })
      );
    }
  }

  private dateReviver(key: string, value: string) {
    var a;
    if (typeof value === 'string' && value.length === 20) {
      a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
      if (a) {
        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]));
      }
    }
    return value;
  };
}