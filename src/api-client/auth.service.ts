import { Injectable, Inject } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';

import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { tap } from 'rxjs/operators';

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
export class AuthService {
  private config: ApiClientConfig = <ApiClientConfig>{};

  constructor(
    @Inject(userConfigToken) userConfig: ApiClientConfig,
    private oauthService: OAuthService,
    protected storage: StorageService) {

    this.config = Object.assign({}, defaultConfig, userConfig);
    if (! this.config.authApiUrl) {
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
    return fromPromise(<Promise<Auth>>this.oauthService.fetchTokenUsingPasswordFlow(username, password)).pipe(
      tap((auth: Auth) => {
        this.setAdditionalAuthData(auth);    
      })
    );
  }

  logout(): void {
    this.oauthService.logOut();
    this.removeAdditionalAuthData();
  }

  getAccessToken() {
    return this.oauthService.getAccessToken();
  }

  refreshToken() {
    return fromPromise(<Promise<Auth>>this.oauthService.refreshToken()).pipe(
      tap((auth: Auth) => {
        this.setAdditionalAuthData(auth);
      })
    );
  }

  setAdditionalAuthData(auth: any) {
    if (this.config.authAdditionalData) {
      for (let i = 0; i < this.config.authAdditionalData.length; i++) {
        if (auth[this.config.authAdditionalData[i]] !== undefined) {
          this.storage.setItem(this.config.authAdditionalData[i], auth[this.config.authAdditionalData[i]]);
        }
      } 
    }
  }

  removeAdditionalAuthData() {
    if (this.config.authAdditionalData) {
      for (let i = 0; i < this.config.authAdditionalData.length; i++) {
        this.storage.removeItem(this.config.authAdditionalData[i]);
      }
    }
  }
}
