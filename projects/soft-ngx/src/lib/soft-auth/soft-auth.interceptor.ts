import { Injectable, Optional, Inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpEvent,
} from '@angular/common/http';

import { Observable, throwError, of, Observer, Subject, EMPTY } from 'rxjs';
import { mergeMap, catchError, take } from 'rxjs/operators';

import { SoftAuthInterceptorConfig } from './soft-auth.config';
import { SoftAuthServiceInterface } from './soft-auth.service.interface';
import { authServiceClassForSoftAuthInterceptorToken, userSoftAuthInterceptorConfigToken } from './user-config.token';

@Injectable({
  providedIn: 'root',
})
export class SoftAuthInterceptor implements HttpInterceptor {

  protected config: Required<SoftAuthInterceptorConfig> = {
    autoRefreshToken: false,
    loginScreenUrl: '', // redirect to this login url if cannot get new token
    forceSendToken: false,
  };

  private _isRefreshing = false;
  private _refresherStream: Subject<boolean> = new Subject<boolean>();

  constructor(
    @Inject(authServiceClassForSoftAuthInterceptorToken) protected authService: SoftAuthServiceInterface,
    @Optional() @Inject(userSoftAuthInterceptorConfigToken) userConfig?: SoftAuthInterceptorConfig) {

    if (userConfig) {
      Object.assign(this.config, userConfig);
    }
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.config.forceSendToken) {
      request = this.setAuthHeader(request);
    } else if (request.headers.has('Authorization')) {
      if (this.authService.isLoggedIn) {
        request = this.setAuthHeader(request);
      } else {
        if (this.config.autoRefreshToken) {
          return this.refreshTokenAndRetry$(request, next);
        }
        if (this.config.loginScreenUrl) {
          return this.redirectToLoginUrl$();
        }
      }
    }
    return next.handle(request).pipe(
      catchError(err => {
        if (err.status === 401) {
          if (this.config.autoRefreshToken) {
            return this.refreshTokenAndRetry$(request, next, err);
          }
          if (this.config.loginScreenUrl) {
            return this.redirectToLoginUrl$();
          }
        }
        return throwError(err);
      }),
    );
  }

  protected setAuthHeader(request: HttpRequest<any>): HttpRequest<any> {
    let scheme = this.authService.getAuthenticationScheme() || '';
    if (scheme) {
      scheme += ' ';
    }
    return request.clone({
      setHeaders: {
        Authorization: scheme + this.authService.getAccessToken(),
      },
    });
  }

  protected refreshTokenAndRetry$(request: HttpRequest<any>, next: HttpHandler, err?): Observable<any> {
    if (typeof this.authService.requestRefreshToken$ !== 'function') {
      throw Error('authService is neeeded to implement requestRefreshToken$()');
    }
    if (this.authService.skipUrlsForAutoRefreshToken) {
      const skipUrls = this.authService.skipUrlsForAutoRefreshToken();
      if (skipUrls.indexOf(request.url) !== -1) {
        return throwError(err);
      }
    }
    // if refreshing, wait next _refresherStream
    if (this._isRefreshing) {
      // console.debug('Another request is waiting first request');
      return new Observable((observer: Observer<boolean>) => {
        this._refresherStream.pipe(
          take(1),
        ).subscribe(isSuccess => {
          observer.next(isSuccess);
          observer.complete();
        });
      }).pipe(
        mergeMap(isSuccess => {
          // console.debug('Another request stop waiting');
          if (isSuccess) {
            // console.debug('Another request excute with new token');
            request = this.setAuthHeader(request);
          } else if (this.config.loginScreenUrl) {
            return EMPTY; // try to silent another request b/c first request will be redirect to loginScreenUrl
          }
          return next.handle(request);
        }),
      );
    } else {
      // console.debug('First request start refresh token');
      this._isRefreshing = true;

      return this.authService.requestRefreshToken$!().pipe(
        catchError(() => {
          return of(null);
        }),
        mergeMap(auth => {
          // console.debug('First request finish refresh token');
          const isSuccess = !!auth;
          // console.debug('refresh success:', isSuccess);
          this._isRefreshing = false;
          this._refresherStream.next(isSuccess);
          if (isSuccess) {
            // console.debug('First request excute with new token');
            request = this.setAuthHeader(request);
          } else if (this.config.loginScreenUrl) {
            return this.redirectToLoginUrl$();
          }
          return next.handle(request);
        }),
      );
    }
  }

  protected redirectToLoginUrl$(): Observable<any> {
    window.location.href = this.config.loginScreenUrl;
    return EMPTY;
  }
}
