import { Injectable, Inject } from '@angular/core';
import { AuthConfig as AOOAuthConfig, OAuthService } from 'angular-oauth2-oidc';

import { Observable, from, empty, Subject, Observer, of } from 'rxjs';
import { tap, mergeMap, catchError } from 'rxjs/operators';

import { AuthServiceInterface } from './auth.service.interface';
import { Auth } from './auth.model';
export { Auth };

import { StorageService } from '../storage/storage.service';
import { WindowClass, windowToken } from '../window';

import { AuthConfig, defaultConfig } from './auth.config';
import { userConfigToken } from './user-config.token';

const authConfig: AOOAuthConfig = {
  oidc: false,
  requireHttps: false
};

@Injectable()
export class AuthService implements AuthServiceInterface {

  config = {} as AuthConfig;
  authenticationScheme: string;
  hasRefreshToken: boolean;
  loginScreenUrl: string;

  private isRefreshing: boolean = false;
  private refresherStream: Subject<boolean> = new Subject<boolean>();

  constructor(
    @Inject(userConfigToken) userConfig: AuthConfig,
    @Inject(windowToken) private window: WindowClass,
    protected oauthService: OAuthService,
    protected storage: StorageService) {

    this.config = Object.assign({}, defaultConfig, userConfig);
    if (!this.config.authApiUrl) {
      throw new TypeError('AuthConfig is needed to set authApiUrl');
    }
    authConfig.tokenEndpoint = this.config.authApiUrl;
    this.authenticationScheme = this.config.authenticationScheme!;
    this.hasRefreshToken = this.config.hasRefreshToken!;
    this.loginScreenUrl = this.config.loginScreenUrl!;
    this.oauthService.configure(authConfig);
    this.oauthService.setStorage(storage);
  }

  get isLoggedIn(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

  login$(username: string, password: string): Observable<Auth> {
    return from(<Promise<Auth>>this.oauthService.fetchTokenUsingPasswordFlow(username, password)).pipe(
      tap((auth: Auth) => {
        this.setAdditionalAuthData(auth);
      })
    );
  }

  logout(): void {
    this.oauthService.logOut();
    this.removeAdditionalAuthData();
  }

  getAccessToken(): string {
    return this.oauthService.getAccessToken();
  }

  refreshToken(): Observable<boolean> {
    if (!this.hasRefreshToken) {
      if (this.loginScreenUrl) {
        // re-login
        this.window.location.href = this.loginScreenUrl;
      }
      return empty();
    }

    // if refreshing, wait next refresherStream
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
            return of(true);
          } else {
            return of(false);
          }
        })
      );
    } else {
      console.debug('Start refresh token');
      this.isRefreshing = true;

      return from(<Promise<Auth>>this.oauthService.refreshToken()).pipe(
        catchError(err => {
          console.log(err);
          return of(null);
        }),
        mergeMap(auth => {
          console.debug('Finish refresh token');
          let isSuccess = !!auth;
          this.isRefreshing = false;
          this.refresherStream.next(isSuccess);
          this.refresherStream.complete();
          if (isSuccess) {
            this.setAdditionalAuthData(auth);
            return of(true);
          } else {
            if (this.loginScreenUrl) {
              // re-login
              this.window.location.href = this.loginScreenUrl;
            }
            return of(false);
          }
        })
      );
    }
  }

  setAdditionalAuthData(auth: any): void {
    if (this.config.authAdditionalData) {
      for (let i = 0; i < this.config.authAdditionalData.length; i++) {
        if (auth[this.config.authAdditionalData[i]] !== undefined) {
          this.storage.setItem(this.config.authAdditionalData[i], auth[this.config.authAdditionalData[i]]);
        }
      }
    }
  }

  removeAdditionalAuthData(): void {
    if (this.config.authAdditionalData) {
      for (let i = 0; i < this.config.authAdditionalData.length; i++) {
        this.storage.removeItem(this.config.authAdditionalData[i]);
      }
    }
  }
}
