import { Observable } from 'rxjs';

export interface AuthServiceInterface {

  authApiUrl: string;

  isLoggedIn: boolean;

  logout(): void;

  getAccessToken(): string;

  requestTokenWithPasswordFlow$?(username: string, password: string): Observable<any>,

  requestRefreshToken$?(): Observable<any>;
}