import { Injectable, Inject, Optional } from '@angular/core';
import { AuthConfig as AOOAuthConfig, OAuthService } from 'angular-oauth2-oidc';

import { Observable, from } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AuthServiceInterface } from './auth.service.interface';
import { Auth } from './auth.model';
export { Auth };

import { StorageService } from '../storage/storage.service';

import { AuthConfig } from './auth.config';
import { userConfigToken } from './user-config.token';

const authConfig: AOOAuthConfig = {
  oidc: false,
  requireHttps: false
};

@Injectable()
export class AuthService implements AuthServiceInterface {

  private _authApiUrl!: string;

  get authApiUrl(): string {
    return this._authApiUrl;
  }

  get isLoggedIn(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

  constructor(
    protected oauthService: OAuthService,
    protected storage: StorageService,
    @Optional() @Inject(userConfigToken) userConfig?: AuthConfig) {

    if (userConfig) {
      if (userConfig.authApiUrl !== undefined) {
        this.setAuthApiUrl(userConfig.authApiUrl);
      }
    }

    this.oauthService.setStorage(storage);
  }

  protected setAuthApiUrl(url: string) {
    this._authApiUrl = url;
    this.oauthService.configure(Object.assign({}, authConfig, { tokenEndpoint: url }));
  }

  // remove token and auth data in storage
  logout(): void {
    this.oauthService.logOut();
    this.removeAdditionalAuthData();
  }

  getAccessToken(): string {
    return this.oauthService.getAccessToken();
  }

  // request token and keep token and auth data in storage
  requestTokenWithPasswordFlow$(username: string, password: string): Observable<Auth> {
    if (!this.authApiUrl) {
      throw new Error('authApiUrl is needed to be set');
    }
    return from(<Promise<Auth>>this.oauthService.fetchTokenUsingPasswordFlow(username, password)).pipe(
      tap((auth: Auth) => {
        if (auth) {
          this.setAdditionalAuthData(auth);
        }
      })
    );
  }

  // request refreshToken and keep new token and auth data in storage
  requestRefreshToken$(): Observable<Auth> {
    if (!this.authApiUrl) {
      throw new Error('authApiUrl is need to be set');
    }
    return from(<Promise<Auth>>this.oauthService.refreshToken()).pipe(
      tap((auth: Auth) => {
        if (auth) {
          this.setAdditionalAuthData(auth);
        }
      })
    );
  }

  // override if any additional auth response data that need to keep
  getAdditionalAuthData(): string[] {
    return [];
  }

  setAdditionalAuthData(auth: any): void {
    let data = this.getAdditionalAuthData();
    for (let i = 0; i < data.length; i++) {
      if (auth[data[i]] !== undefined) {
        this.storage.setItem(data[i], auth[data[i]]);
      }
    }
  }

  removeAdditionalAuthData(): void {
    let data = this.getAdditionalAuthData();
    for (let i = 0; i < data.length; i++) {
      this.storage.removeItem(data[i]);
    }
  }
}
