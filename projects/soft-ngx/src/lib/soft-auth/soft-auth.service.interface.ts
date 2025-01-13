import { Observable } from 'rxjs';

export enum SoftAuthHeader {
  Authorization = 'Authorization',
  CustomRefreshToken = 'CustomRefreshToken',
  newAccessToken = 'newAccessToken',
  newRefreshToken = 'newRefreshToken',
}

export interface AuthData {
  [key: string]: any;
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

export interface SoftAuthServiceInterface {

  /*
   * check is logged in or token expires
   */
  isLoggedIn: () => boolean;

  /*
   * logout remove token by call removeAuthData();
   * override to do more
   */
  logout(): void;

  /*
   * remove token and auth data in storage
   */
  removeAuthData(): void;

  /*
   * get access token
   */
  getAccessToken(): string | null;

  /*
   * get refresh token
   */
  getRefreshToken(): string | null;

  /*
   * get authentication scheme
   */
  getAuthenticationScheme(): string;

  /*
   * to skip auto refresh token when these request urls got 401 unauthorized
   */
  skipUrlsForAutoRefreshToken?(): string[];

  /*
   * request access_token and keep auth data in storage
   */
  requestTokenWithPasswordFlow$?(username: string, password: string, customQuery?: any): Observable<AuthData>;

  /*
   * request new access_token by refresh_token and keep auth data in storage
   */
  requestRefreshToken$?(customQuery?: any, refreshToken?: string): Observable<AuthData>;
}
