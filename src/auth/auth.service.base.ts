import { Injectable, Inject, Optional } from '@angular/core';

import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { AuthServiceInterface } from './auth.service.interface';

import { StorageService } from '../storage/storage.service';

import { AuthServiceConfig, CustomAuthRequestKey, CustomAuthResponseKey } from './auth.config';
import { userAuthServiceConfigToken } from './user-config.token';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { WebHttpUrlEncodingCodec } from './encoder';

// TODO: remove custom mapped type when upgrade to Typescript 2.8
export type Required<T> = {
  [P in keyof T]: T[P];
};

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
  }

  protected customAuthRequestKey: Required<CustomAuthRequestKey> = {
    username: 'username',
    password: 'password',
    refresh_token: 'refresh_token'
  }

  protected customAuthResponseKey: Required<CustomAuthResponseKey> = {
    access_token: 'access_token',
    refresh_token: 'refresh_token',
    expires_in: 'expires_in',
    scope: 'scope'
  }

  constructor(
    protected http: HttpClient,
    protected storage: StorageService,
    @Optional() @Inject(userAuthServiceConfigToken) userConfig?: AuthServiceConfig) {

    if (userConfig) {
      Object.assign(this.config, userConfig);
    }

    this.config.refreshTokenUrl = this.config.refreshTokenUrl || this.config.tokenUrl;
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
   * remove token and auth data in storage
   */
  logout(): void {
    this.storage.removeItem('access_token');
    this.storage.removeItem('refresh_token');
    this.storage.removeItem('nonce');
    this.storage.removeItem('expires_at');
    this.storage.removeItem('claims_obj');
    this.storage.removeItem('granted_scopes');
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
    return this.config.authenticationScheme!; // TODO: remove ! when upgrade to Typescript 2.8
  }

  getRefreshToken(): string | null {
    return this.storage.getItem('refresh_token');
  }

  /*
   * for auth interceptor's autoRefreshToken option (to ignore refresh token url)
   */
  getRefreshTokenUrl(): string {
    return this.config.refreshTokenUrl!; // TODO: remove ! when upgrade to Typescript 2.8
  }

  /*
   * request access_token and keep auth data in storage
   */
  requestTokenWithPasswordFlow$(username: string, password: string, customQuery?: any): Observable<any> {
    if (!this.config.tokenUrl) {
      throw new Error('authApiUrl is needed to be set');
    }
    let body = {} as any;
    let params = new HttpParams({ encoder: new WebHttpUrlEncodingCodec() });
    let headers = new HttpHeaders();

    if (this.config.isOAuth) {
      params = params
        .set('username', username)
        .set('password', password)
        .set('grant_type', 'password')
        .set('scope', this.config.scope!) // TODO: remove ! when upgrade to Typescript 2.8
        .set('client_id', this.config.clientId!); // TODO: remove ! when upgrade to Typescript 2.8
      this.config.isFormData = true;
    } else {
      if (this.config.isFormData) {
        params = params
          .set(this.customAuthRequestKey.username, username)
          .set(this.customAuthRequestKey.password, password);
      } else {
        body = {
          username,
          password
        };
      }
    }

    return this.requestToken(this.config.tokenUrl, body, params, headers, customQuery);
  }

  /*
   * request new access_token by refresh_token and keep auth data in storage
   */
  requestRefreshToken$(customQuery?: any): Observable<any> {
    if (!this.config.refreshTokenUrl) {
      throw new Error('authApiUrl is need to be set');
    }
    let refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('no refresh token');
    }

    let body = {} as any;
    let params = new HttpParams({ encoder: new WebHttpUrlEncodingCodec() });
    let headers = new HttpHeaders();

    if (this.config.isOAuth) {
      params = params
        .set('grant_type', 'refresh_token')
        .set('scope', this.config.scope!) // TODO: remove ! when upgrade to Typescript 2.8
        .set('client_id', this.config.clientId!) // TODO: remove ! when upgrade to Typescript 2.8
        .set('refresh_token', refreshToken);

      this.config.isFormData = true;
    } else {
      if (this.config.isFormData) {
        params = params
          .set(this.customAuthRequestKey.refresh_token!, refreshToken); // TODO: remove ! when upgrade to Typescript 2.8
      } else {
        body = { refreshToken };
      }
    }

    return this.requestToken(this.config.refreshTokenUrl, body, params, headers, customQuery);
  }

  // general request token in common
  requestToken(url: string, body: any, params: HttpParams, headers: HttpHeaders, customQuery?: any): Observable<any> {
    if (customQuery) {
      if (this.config.isFormData) {
        for (const key of Object.getOwnPropertyNames(customQuery)) {
          params = params.set(key, customQuery[key]);
        }
      } else {
        body = Object.assign({}, body, customQuery);
      }
    }

    if (this.config.isFormData) {
      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
    }

    return this.http.post(url, body, { params, headers }).pipe(
      mergeMap((response: any) => {
        if (response) {
          if (!this.config.isOAuth) {
            Object.assign(response, this.customAuthResponseKey);
          }
          if (this.config.isJWT) {
            let [claims, claimsJson] = this.decodeIdToken(response.access_token);
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
