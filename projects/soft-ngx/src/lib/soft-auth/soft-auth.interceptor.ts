import { Injectable, Optional, Inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpEvent,
} from '@angular/common/http';

import { Observable, throwError, of, Subject, EMPTY } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';

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

  private isRefreshing = {} as { [refreshToken: string]: boolean };
  private refresher = {} as { [refreshToken: string]: Subject<boolean> };

  constructor(
    @Inject(authServiceClassForSoftAuthInterceptorToken) protected authService: SoftAuthServiceInterface,
    @Optional() @Inject(userSoftAuthInterceptorConfigToken) userConfig?: SoftAuthInterceptorConfig) {

    if (userConfig) {
      Object.assign(this.config, userConfig);
    }
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const refreshToken = request.headers.get('AuthorizationRefresh') || this.authService.getRefreshToken();
    if (request.headers.has('AuthorizationRefresh')) {
      request = request.clone({
        headers: request.headers.delete('AuthorizationRefresh'),
      });
    }

    if (this.config.forceSendToken) {
      request = this.setAuthHeader(request);
    } else if (request.headers.get('Authorization') === 'ACCESS_TOKEN') {
      if (this.authService.isLoggedIn) {
        request = this.setAuthHeader(request);
      } else {
        if (this.config.autoRefreshToken && refreshToken) {
          return this.refreshTokenAndRetry$(request, refreshToken, next);
        }
        if (this.config.loginScreenUrl) {
          return this.redirectToLoginUrl$();
        }
      }
    }

    return next.handle(request).pipe(
      catchError(err => {
        if (err.status === 401) {
          if (this.config.autoRefreshToken && refreshToken) {
            return this.refreshTokenAndRetry$(request, refreshToken, next, err);
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

  protected refreshTokenAndRetry$(request: HttpRequest<any>, refreshToken: string, next: HttpHandler, err?: any): Observable<any> {
    if (typeof this.authService.requestRefreshToken$ !== 'function') {
      throw Error('authService is needed to implement requestRefreshToken$()');
    }
    if (this.authService.skipUrlsForAutoRefreshToken) {
      const skipUrls = this.authService.skipUrlsForAutoRefreshToken();
      if (skipUrls.indexOf(request.url) !== -1) {
        return throwError(err);
      }
    }

    // init refresher
    this.refresher[refreshToken] = this.refresher[refreshToken] || new Subject<boolean>();

    // if refreshing, wait next refresher
    if (this.isRefreshing[refreshToken]) {
      // console.debug('Another request is waiting first request');
      return this.refresher[refreshToken].pipe(
        mergeMap(isSuccess => {
          // console.debug('Another request stop waiting');
          if (isSuccess) {
            // console.debug('Another request execute with new token');
            request = this.setAuthHeader(request);
          } else if (this.config.loginScreenUrl) {
            return EMPTY; // try to silent another request b/c first request will be redirect to loginScreenUrl
          }
          return next.handle(request);
        }),
      );
    } else {
      // console.debug('First request start refresh token');
      this.isRefreshing[refreshToken] = true;
      return this.authService.requestRefreshToken$(undefined, refreshToken).pipe(
        catchError(() => {
          return of(null);
        }),
        mergeMap(auth => {
          // console.debug('First request finish refresh token');
          const isSuccess = !!auth;
          // console.debug('refresh success:', isSuccess);
          this.isRefreshing[refreshToken] = false;
          this.refresher[refreshToken].next(isSuccess);
          this.refresher[refreshToken].complete();
          if (isSuccess) {
            // console.debug('First request execute with new token');
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
