import { Injectable, Optional, Inject } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError, of, Subject, EMPTY, from } from 'rxjs';
import { mergeMap, catchError, map } from 'rxjs/operators';

import { SoftAuthInterceptorConfig } from './soft-auth.config';
import { AuthData, SoftAuthHeader, SoftAuthServiceInterface } from './soft-auth.service.interface';
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
  private refresher = {} as { [refreshToken: string]: Subject<AuthData> };

  constructor(
    @Inject(authServiceClassForSoftAuthInterceptorToken) protected authService: SoftAuthServiceInterface,
    @Optional() @Inject(userSoftAuthInterceptorConfigToken) userConfig?: SoftAuthInterceptorConfig) {

    if (userConfig) {
      Object.assign(this.config, userConfig);
    }
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from((async () => {
      const isLoggedIn = await this.authService.isLoggedIn();
      const accessToken = await this.authService.getAccessToken();
      const refreshToken = await this.authService.getRefreshToken();
      return {isLoggedIn, accessToken, refreshToken}
    })()).pipe(
      mergeMap(({isLoggedIn, accessToken, refreshToken}) => {
        const customRefreshToken = request.headers.get(SoftAuthHeader.CustomRefreshToken);
        if (request.headers.has(SoftAuthHeader.CustomRefreshToken)) {
          request = request.clone({
            setHeaders: { [SoftAuthHeader.CustomRefreshToken]: '-' }
          });
        }

        if (request.headers.get(SoftAuthHeader.Authorization) === 'ACCESS_TOKEN') {
          if (this.config.forceSendToken) {
            request = this.setAuthHeader(request, accessToken);
          } else {
            if (isLoggedIn) {
              request = this.setAuthHeader(request, accessToken);
            } else {
              if (this.config.autoRefreshToken && (customRefreshToken || refreshToken)) {
                return this.refreshTokenAndRetry$(request, next, undefined, customRefreshToken);
              }
              if (this.config.loginScreenUrl) {
                return this.redirectToLoginUrl$();
              }
            }
          }
        }

        return next.handle(request).pipe(
          catchError(err => {
            if (err.status === 401) {
              if (this.config.autoRefreshToken && (customRefreshToken || refreshToken)) {
                return this.refreshTokenAndRetry$(request, next, err, customRefreshToken);
              }
              if (this.config.loginScreenUrl) {
                return this.redirectToLoginUrl$();
              }
            }
            return throwError(() => err);
          }),
        );
      }) 
    );
  }

  protected setAuthHeader(request: HttpRequest<any>, accessToken: string): HttpRequest<any> {
    let scheme = this.authService.getAuthenticationScheme() || '';
    if (scheme) {
      scheme += ' ';
    }
    return request.clone({
      setHeaders: {
        [SoftAuthHeader.Authorization]: scheme + accessToken,
      },
    });
  }

  protected refreshTokenAndRetry$(request: HttpRequest<any>, next: HttpHandler, err?: any, customRefreshToken?: string): Observable<any> {
    if (typeof this.authService.requestRefreshToken$ !== 'function') {
      throw Error('authService is needed to implement requestRefreshToken$()');
    }
    if (this.authService.skipUrlsForAutoRefreshToken) {
      const skipUrls = this.authService.skipUrlsForAutoRefreshToken();
      if (skipUrls.indexOf(request.url) !== -1) {
        return throwError(() => err);
      }
    }

    return from((async () => {
      const refreshToken = await this.authService.getRefreshToken();
      return refreshToken;
    })()).pipe(
      mergeMap(_refreshToken => {
        // init refresher
        const refreshToken = customRefreshToken || _refreshToken;
        this.refresher[refreshToken] = this.refresher[refreshToken] || new Subject<AuthData>();

        // if refreshing, wait next refresher
        if (this.isRefreshing[refreshToken]) {
          // console.debug('Another request is waiting first request');
          return this.refresher[refreshToken].pipe(
            mergeMap(authData => {
              // console.debug('Another request stop waiting');
              if (authData) {
                return this.continueRequest(next, request, authData);
              } else if (this.config.loginScreenUrl) {
                return EMPTY; // try to silent another request b/c first request will be redirect to loginScreenUrl
              }
              return this.errorRequest(next, request);
            }),
          );
        } else {
          // console.debug('First request start refresh token');
          this.isRefreshing[refreshToken] = true;
          return this.authService.requestRefreshToken$(undefined, customRefreshToken).pipe(
            catchError(err => {
              this.isRefreshing[refreshToken] = false;
              this.refresher[refreshToken].next(null);
              this.refresher[refreshToken].complete();

              if (!customRefreshToken && this.config.loginScreenUrl) {
                return this.redirectToLoginUrl$();
              }
              return this.errorRequest(next, request);
            }),
            mergeMap((authData: AuthData) => {
              // console.debug('First request finish refresh token');
              // console.debug('refresh success:', isSuccess);
              this.isRefreshing[refreshToken] = false;
              this.refresher[refreshToken].next(authData);
              this.refresher[refreshToken].complete();

              // console.debug('First request execute with new token');
              return this.continueRequest(next, request, authData);
            }),
          );
        }
      })
    );
  }

  protected continueRequest(next: HttpHandler, request: HttpRequest<any>, authData: AuthData) {
    request = this.setAuthHeader(request, authData.access_token);
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        return throwError(() => new HttpErrorResponse({
          error: err.error,
          headers: err.headers
            .set(SoftAuthHeader.newAccessToken, authData.access_token)
            .set(SoftAuthHeader.newRefreshToken, authData.refresh_token),
          status: err.status,
          statusText: err.statusText,
          url: err.url
        }));
      }),
      map(event => {
        if (event instanceof HttpResponse) {
          return event.clone({
            headers: event.headers
              .set(SoftAuthHeader.newAccessToken, authData.access_token)
              .set(SoftAuthHeader.newRefreshToken, authData.refresh_token)
          });
        }
        return event;
      })
    );
  }

  protected errorRequest(next: HttpHandler, request: HttpRequest<any>) {
    return next.handle(request).pipe(
      catchError(err => {
        err.error = 'REFRESH_TOKEN_FAILED';
        return throwError(() => err);
      })
    );
  }

  protected redirectToLoginUrl$(): Observable<any> {
    return from(this.authService.removeAuthData()).pipe(
      mergeMap(() => {
        window.location.href = this.config.loginScreenUrl;
        return EMPTY;
      })
    )
  }
}
