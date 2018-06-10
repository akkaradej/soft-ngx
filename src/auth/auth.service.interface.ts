import { Observable } from 'rxjs';

export interface AuthServiceInterface {

  authenticationScheme: string;

  hasRefreshToken: boolean;

  loginScreenUrl: string;

  readonly isLoggedIn: boolean;

  login$(username: string, password: string): Observable<any>,

  logout(): void;

  getAccessToken(): string;

  refreshToken?(): Observable<any>;
}