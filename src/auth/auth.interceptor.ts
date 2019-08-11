import { Injectable, Optional, Inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpEvent
} from '@angular/common/http';

import { WindowClass, getWindow } from "./../window";

import { AuthServiceBase } from './auth.service.base';
import { Observable, empty, throwError, of, Observer, Subject } from 'rxjs';
import { mergeMap, catchError, take } from 'rxjs/operators';

import { AuthInterceptorConfig } from './auth.config';
import { userAuthInterceptorConfigToken } from './user-config.token';
import { AuthServiceInterface } from './auth.service.interface';

// TODO: remove custom mapped type when upgrade to Typescript 2.8
export type Required<T> = {
  [P in keyof T]: T[P];
};

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  protected config: Required<AuthInterceptorConfig> = {
    autoRefreshToken: false,
    loginScreenUrl: '' // redirect to this login url if cannot get new token
  };

  private _isRefreshing: boolean = false;
  private _refresherStream: Subject<boolean> = new Subject<boolean>();

  constructor(
    @Inject(AuthServiceBase) protected authService: AuthServiceInterface,
    @Optional() @Inject(userAuthInterceptorConfigToken) userConfig?: AuthInterceptorConfig,
    // inject window that make easy to test
    protected window: WindowClass = getWindow()) {

    if (userConfig) {
      Object.assign(this.config, userConfig);
    }
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.headers.has('Authorization')) {
      if (this.authService.isLoggedIn) {
        request = this.setAuthHeader(request);
      } else {
        if (this.config.autoRefreshToken) {
          return this.refreshTokenAndRetry$(request, next);
        }
        if (this.config.loginScreenUrl) {
          this.redirectToLoginUrl();
          return empty();
        }
      }
    }
    return next.handle(request).pipe(
      catchError(err => {
        if (err.status == 401) {
          if (this.config.autoRefreshToken) {
            return this.refreshTokenAndRetry$(request, next);
          }
          if (this.config.loginScreenUrl) {
            this.redirectToLoginUrl();
            return empty();
          }
        }
        return throwError(err);
      })
    );
  }

  protected setAuthHeader(request: HttpRequest<any>): HttpRequest<any> {
    let scheme = this.authService.getAuthenticationScheme() || '';
    if (scheme) {
      scheme += ' ';
    }
    return request.clone({
      setHeaders: {
        Authorization: scheme + this.authService.getAccessToken()
      }
    });
  }

  protected refreshTokenAndRetry$(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    if (typeof this.authService.requestRefreshToken$ != 'function') {
      throw Error('authService is neeeded to implement requestRefreshToken$()');
    }
    if (this.authService.getRefreshTokenUrl && request.url == this.authService.getRefreshTokenUrl()) {
      return throwError('ignore to refresh the refreshToken request (itself)');
    }
    // if refreshing, wait next _refresherStream
    if (this._isRefreshing) {
      console.debug('Another request is waiting first request');
      return Observable.create((observer: Observer<boolean>) => {
        this._refresherStream.pipe(
          take(1)
        ).subscribe(isSuccess => {
          observer.next(isSuccess);
          observer.complete();
        });
      }).pipe(
        mergeMap(isSuccess => {
          console.debug('Another request stop waiting');
          if (isSuccess) {
            console.debug('Another request excute with new token');
            request = this.setAuthHeader(request);
          } else if (this.config.loginScreenUrl) {
            return empty(); // try to silent another request b/c first request will be redirect to loginScreenUrl
          }
          return next.handle(request);
        })
      );
    } else {
      console.debug('First request start refresh token');
      this._isRefreshing = true;

      return this.authService.requestRefreshToken$!().pipe(
        catchError(err => {
          return of(null);
        }),
        mergeMap(auth => {
          console.debug('First request finish refresh token');
          let isSuccess = !!auth;
          console.debug('refresh success:', isSuccess);
          this._isRefreshing = false;
          this._refresherStream.next(isSuccess);
          if (isSuccess) {
            console.debug('First request excute with new token');
            request = this.setAuthHeader(request);
          } else if (this.config.loginScreenUrl) {
            this.redirectToLoginUrl();
            return empty();
          }
          return next.handle(request);
        })
      );
    }
  }

  protected redirectToLoginUrl() {
    this.window.location.href = this.config.loginScreenUrl!; // TODO: remove ! when upgrade to Typescript 2.8
  }
}
