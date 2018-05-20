import { Injectable, Inject } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';

import { Observable, from } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AuthServiceInterface } from './auth.service.interface';
import { Auth } from './auth.model';
export { Auth };

import { StorageService } from './storage.service';

import { ApiClientConfig, defaultConfig } from './api-client.config';
import { userConfigToken } from './user-config.token';

const authConfig: AuthConfig = {
  oidc: false,
  requireHttps: false
};

@Injectable()
export class AuthService implements AuthServiceInterface {

  readonly authenticationScheme = 'Bearer';
  readonly hasRefreshToken: boolean = true;
  config: ApiClientConfig = <ApiClientConfig>{};

  constructor(
    @Inject(userConfigToken) userConfig: ApiClientConfig,
    protected oauthService: OAuthService,
    protected storage: StorageService) {

    this.config = Object.assign({}, defaultConfig, userConfig);
    if (!this.config.authApiUrl) {
      throw new TypeError('ApiClientConfig is needed to set authApiUrl');
    }
    authConfig.tokenEndpoint = this.config.authApiUrl;
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

  refreshToken(): Observable<Auth> {
    return from(<Promise<Auth>>this.oauthService.refreshToken()).pipe(
      tap((auth: Auth) => {
        this.setAdditionalAuthData(auth);
      })
    );
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
