import { Observable } from 'rxjs';

export interface AuthServiceInterface {

  readonly authenticationScheme: string;

  readonly isLoggedIn: boolean;

  readonly hasRefreshToken: boolean;

  login$(username: string, password: string): Observable<any>,

  logout(): void;

  getAccessToken(): string;

  refreshToken?(): Observable<any>;
}