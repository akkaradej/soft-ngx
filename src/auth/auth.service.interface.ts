import { Observable } from 'rxjs';

export interface AuthServiceInterface {

  /*
   * check is logged in or token expires
   */
  isLoggedIn: boolean;

  /*
   * remove token and auth data in storage
   */
  logout(): void;

  /*
   * get access token
   */
  getAccessToken(): string | null;

  /*
   * get authentication scheme
   */
  getAuthenticationScheme(): string;

  /*
   * for auth interceptor's autoRefreshToken option (to ignore refresh token url)
   */
  getRefreshTokenUrl?(): string;

  /*
   * request access_token and keep auth data in storage
   */
  requestTokenWithPasswordFlow$?(username: string, password: string, customQuery?: any): Observable<any>,

  /*
   * request new access_token by refresh_token and keep auth data in storage
   */
  requestRefreshToken$?(customQuery?: any): Observable<any>;
}