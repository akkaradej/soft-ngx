import { Injectable, Inject, Optional } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { StorageService } from '../storage/storage.service';

import { AuthServiceInterface } from './auth.service.interface';
import { AuthServiceConfig, CustomAuthRequestKey, CustomAuthResponseKey } from './auth.config';
import { userAuthServiceConfigToken, userCustomAuthRequestKeyToken, userCustomAuthResponseKeyToken } from './user-config.token';
import { WebHttpUrlEncodingCodec } from './encoder';

@Injectable()
export class AuthServiceBase implements AuthServiceInterface {

  protected config: Required<AuthServiceConfig> = {
    authenticationScheme: 'Bearer',
    tokenUrl: '',
    refreshTokenUrl: '',
    isFormData: true,
    isJWT: true,
    isOAuth: true, // if true, it will be force isFormData = true
    scope: '',
    clientId: ''
  };

  protected customAuthRequestKey: Required<CustomAuthRequestKey> = {
    username: 'username',
    password: 'password',
    refresh_token: 'refresh_token'
  };

  protected customAuthResponseKey: Required<CustomAuthResponseKey> = {
    access_token: 'access_token',
    refresh_token: 'refresh_token',
    expires_in: 'expires_in',
    scope: 'scope'
  };

  constructor(
    protected http: HttpClient,
    protected storage: StorageService,
    @Optional() @Inject(userAuthServiceConfigToken) userConfig?: AuthServiceConfig,
    @Optional() @Inject(userCustomAuthRequestKeyToken) userCustomAuthRequestKeyConfig?: CustomAuthRequestKey,
    @Optional() @Inject(userCustomAuthResponseKeyToken) userCustomAuthResponseKeyConfig?: CustomAuthResponseKey) {

    if (userConfig) {
      Object.assign(this.config, userConfig);
    }
    if (userCustomAuthRequestKeyConfig) {
      Object.assign(this.customAuthRequestKey, userCustomAuthRequestKeyConfig);
    }
    if (userCustomAuthResponseKeyConfig) {
      Object.assign(this.customAuthResponseKey, userCustomAuthResponseKeyConfig);
    }

    this.config.refreshTokenUrl = this.config.refreshTokenUrl || this.config.tokenUrl;
    this.setStorageDependOnRememberMe();
  }

  /*
   * check is logged in or token expires
   */
  get isLoggedIn(): boolean {
    if (this.getAccessToken()) {
      const expiresAt = this.storage.getItem('expires_at');
      const now = new Date();
      if (expiresAt && parseInt(expiresAt, 10) < now.getTime()) {
        return false;
      }
      return true;
    }
    return false;
  }

  /*
   * check user login with remember me or not
   */
  get isRememberMe() {
    return this.storage.getBooleanPersistent('remember_me');
  }

  /*
   * remove token and auth data in storage
   */
  logout(): void {
    this.storage.removeItem('access_token');
    this.storage.removeItem('refresh_token');
    this.storage.removeItem('nonce');
    this.storage.removeItem('expires_at');
    this.storage.removeItem('claims_obj');
    this.storage.removeItem('granted_scopes');
    this.storage.removeItemPersistent('remember_me');
    this.removeAdditionalAuthData();
  }

  /*
   * get access token
   */
  getAccessToken(): string | null {
    return this.storage.getItem('access_token');
  }

  /*
   * get authentication scheme
   */
  getAuthenticationScheme(): string {
    return this.config.authenticationScheme;
  }

  getRefreshToken(): string | null {
    return this.storage.getItem('refresh_token');
  }

  /*
   * to skip auto refresh token when these request urls got 401 unauthorized
   */
  skipUrlsForAutoRefreshToken(): string[] {
    return [this.config.tokenUrl, this.config.refreshTokenUrl];
  }

  setStorageDependOnRememberMe() {
    const rememberMe = this.storage.getItemPersistent('remember_me');
    if (rememberMe === 'true') {
      this.storage.usePersistent();
    } else if (rememberMe === 'false') {
      this.storage.useTemporary();
    } // else use default Storage
  }

  /*
   * request access_token and keep auth data in storage
   */
  requestTokenWithPasswordFlow$(username: string, password: string, rememberMe?: boolean, customQuery?: any): Observable<any> {
    if (!this.config.tokenUrl) {
      throw new Error('authApiUrl is needed to be set');
    }
    let body: any;
    const params = new HttpParams({ encoder: new WebHttpUrlEncodingCodec() });

    if (this.config.isOAuth) {
      body = params
        .set('username', username)
        .set('password', password)
        .set('grant_type', 'password')
        .set('scope', this.config.scope)
        .set('client_id', this.config.clientId);
      this.config.isFormData = true;
    } else {
      if (this.config.isFormData) {
        body = params
          .set(this.customAuthRequestKey.username, username)
          .set(this.customAuthRequestKey.password, password);
      } else {
        body = {
          [this.customAuthRequestKey.username]: username,
          [this.customAuthRequestKey.password]: password
        };
      }
    }

    if (rememberMe) {
      this.storage.setItemPersistent('remember_me', true);
    } else {
      this.storage.setItemPersistent('remember_me', false);
    }

    return this.requestToken(this.config.tokenUrl, body, customQuery);
  }

  /*
   * request new access_token by refresh_token and keep auth data in storage
   */
  requestRefreshToken$(customQuery?: any): Observable<any> {
    if (!this.config.refreshTokenUrl) {
      throw new Error('authApiUrl is need to be set');
    }
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError('no refresh token');
    }

    let body: any;
    const params = new HttpParams({ encoder: new WebHttpUrlEncodingCodec() });

    if (this.config.isOAuth) {
      body = params
        .set('grant_type', 'refresh_token')
        .set('scope', this.config.scope)
        .set('client_id', this.config.clientId)
        .set('refresh_token', refreshToken);

      this.config.isFormData = true;
    } else {
      if (this.config.isFormData) {
        body = params
          .set(this.customAuthRequestKey.refresh_token, refreshToken);
      } else {
        body = {
          [this.customAuthRequestKey.refresh_token]: refreshToken
        };
      }
    }

    return this.requestToken(this.config.refreshTokenUrl, body, customQuery);
  }

  // general request token in common
  requestToken(url: string, body: any, customQuery?: any, headers = new HttpHeaders()): Observable<any> {
    if (customQuery) {
      if (this.config.isFormData) {
        for (const key of Object.getOwnPropertyNames(customQuery)) {
          body = body.set(key, customQuery[key]);
        }
      } else {
        body = Object.assign({}, body, customQuery);
      }
    }

    if (this.config.isFormData) {
      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
    }

    return this.http.post(url, body, { headers }).pipe(
      mergeMap((response: any) => {
        if (response) {
          this.setStorageDependOnRememberMe();
          if (!this.config.isOAuth) {
            response.access_token = response[this.customAuthResponseKey.access_token];
            response.expires_in = response[this.customAuthResponseKey.expires_in];
            response.refresh_token = response[this.customAuthResponseKey.refresh_token];
            response.scope = response[this.customAuthResponseKey.scope];
          }
          if (this.config.isJWT) {
            const [claims, claimsJson] = this.decodeIdToken(response.access_token);
            this.storage.setItem('claims_obj', claimsJson);
            response.expires_in = response.expires_in || claims.exp;
          }
          this.storeAccessToken(response.access_token, response.refresh_token, response.expires_in, response.scope);
          this.setAdditionalAuthData(response);
        }
        return of(response);
      })
    );
  }

  storeAccessToken(accessToken: string, refreshToken?: string, expiresIn?: number, grantedScopes?: String) {
    this.storage.setItem('access_token', accessToken);

    if (refreshToken) {
      this.storage.setItem('refresh_token', refreshToken);
    }

    if (expiresIn) {
      const expiresInMilliSeconds = expiresIn * 1000;
      const now = new Date();
      const expiresAt = now.getTime() + expiresInMilliSeconds;
      this.storage.setItem('expires_at', '' + expiresAt);
    }

    if (grantedScopes) {
      this.storage.setItem('granted_scopes', JSON.stringify(grantedScopes.split('+')));
    }
  }

  decodeIdToken(idToken: string) {
    const tokenParts = idToken.split('.');
    const claimsBase64 = this.padBase64(tokenParts[1]);
    const claimsJson = this.b64DecodeUnicode(claimsBase64);
    const claims = JSON.parse(claimsJson);

    return [
      claims,
      claimsJson
    ];
  }

  // override if any additional auth response data that need to keep
  getAdditionalAuthData(): string[] {
    return [];
  }

  setAdditionalAuthData(auth: any): void {
    const data = this.getAdditionalAuthData();
    for (let i = 0; i < data.length; i++) {
      if (auth[data[i]] !== undefined) {
        this.storage.setItem(data[i], auth[data[i]]);
      }
    }
  }

  removeAdditionalAuthData(): void {
    const data = this.getAdditionalAuthData();
    for (let i = 0; i < data.length; i++) {
      this.storage.removeItem(data[i]);
    }
  }

  private padBase64(base64data: string): string {
    while (base64data.length % 4 !== 0) {
      base64data += '=';
    }
    return base64data;
  }

  private b64DecodeUnicode(str: string) {
    const base64 = str.replace(/\-/g, '+').replace(/\_/g, '/');

    return decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
  }
}
