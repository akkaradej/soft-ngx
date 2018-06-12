import { Injectable, Optional, Inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor
} from '@angular/common/http';

import { WindowClass, getWindow } from "./../window";

import { AuthServiceBase } from './auth.service';
import { Observable, empty, throwError, of, Observer, Subject } from 'rxjs';
import { mergeMap, catchError, take } from 'rxjs/operators';

import { AuthConfig } from './auth.config';
import { userConfigToken } from './user-config.token';
import { AuthServiceInterface } from './auth.service.interface';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  protected authenticationScheme: string = 'Bearer';
  protected loginScreenUrl: string = ''; // redirect to this login url if cannot get new token

  private _autoRefreshToken: boolean = false;
  private _isRefreshing: boolean = false;
  private _refresherStream: Subject<boolean> = new Subject<boolean>();

  protected get autoRefreshToken(): boolean {
    return this._autoRefreshToken;
  }

  protected set autoRefreshToken(isAuto: boolean) {
    if (typeof this.authService.requestRefreshToken$ != 'function') {
      throw Error('authService is neeeded to implement requestRefreshToken$()');
    }
    this._autoRefreshToken = isAuto;
  }

  constructor(
    @Inject(AuthServiceBase) protected authService: AuthServiceInterface,
    @Optional() @Inject(userConfigToken) userConfig?: AuthConfig,
    // inject window that make easy to test
    protected window: WindowClass = getWindow()) {

    if (userConfig) {
      if (userConfig.authenticationScheme !== undefined) {
        this.authenticationScheme = userConfig.authenticationScheme;
      }
      if (userConfig.autoRefreshToken !== undefined) {
        this.autoRefreshToken = userConfig.autoRefreshToken;
      }
      if (userConfig.loginScreenUrl !== undefined) {
        this.loginScreenUrl = userConfig.loginScreenUrl;
      }
    }
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    if (request.withCredentials) {
      if (this.authService.isLoggedIn) {
        request = this.setAuthHeader(request);
      } else {
        if (this.autoRefreshToken) {
          return this.refreshTokenAndRetry$(request, next);
        }
        if (this.loginScreenUrl) {
          this.redirectToLoginUrl();
          return empty();
        }
      }
    }
    return next.handle(request).pipe(
      catchError(err => {
        if (err.status == 401) {
          if (this.autoRefreshToken) {
            return this.refreshTokenAndRetry$(request, next);
          }
          if (this.loginScreenUrl) {
            this.redirectToLoginUrl();
            return empty();
          }
        }
        return throwError(err);
      })
    );

    // .pipe(
    //   tap((event: HttpEvent<any>) => { }, (err: any) => {
    //     if (err instanceof HttpErrorResponse) {
    //       if (err.status === 401) {
    //         this.sendRefreshToken(request, next);
    //       }
    //     }
    //   })
    // );
  }

  protected setAuthHeader(request: HttpRequest<any>): HttpRequest<any> {
    let scheme = '';
    if (this.authenticationScheme) {
      scheme = this.authenticationScheme + ' ';
    }
    return request.clone({
      setHeaders: {
        Authorization: scheme + this.authService.getAccessToken()
      }
    });
  }

  protected refreshTokenAndRetry$(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    if (request.url == this.authService.authApiUrl) {
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
          } else if (this.loginScreenUrl) {
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
          } else if (this.loginScreenUrl) {
            this.redirectToLoginUrl();
            return empty();
          }
          return next.handle(request);
        })
      );
    }
  }

  protected redirectToLoginUrl() {
    this.window!.location.href = this.loginScreenUrl;
    // window.location.href = this.loginScreenUrl;
  }

}