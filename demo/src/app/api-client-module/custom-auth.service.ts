import { Injectable } from '@angular/core';
import { AuthService, AuthServiceInterface } from 'soft-ngx';
// // Uncomment for Example below
// import { Inject } from '@angular/core';
// import { Auth, AuthConfig, StorageService, authUserConfigToken } from 'soft-ngx';
// import { HttpClient } from '@angular/common/http';
// import { OAuthService } from 'angular-oauth2-oidc';
// import { Observable, config } from 'rxjs';
// import { tap } from 'rxjs/operators';

enum AuthData {
  is_super_admin = 'is_super_admin',
  display_name = 'display_name'
};

@Injectable()
export class CustomAuthService extends AuthService { // or implements AuthServiceInterface {

  // // Example: To create constructor
  // constructor(
  //   oauthService: OAuthService,
  //   storage: StorageService,
  //   private http: HttpClient,
  //   @Inject(authUserConfigToken) config: AuthConfig) {

  //   super(oauthService, storage, config);
  // }

  getAdditionalAuthData() {
    return Object.keys(AuthData);
  }

  get isSuperAdmin(): boolean {
    return this.storage.getBoolean(AuthData.is_super_admin);
  }

  get displayName(): string | null {
    return this.storage.getItem(AuthData.display_name);
  }

  // // Example: To post with HttpClient's json data instead of angular-oauth2-oidc's form-data
  // login$(username: string, password: string): Observable<Auth> {
  //   return this.http.post(this.authApiUrl, { username, password }).pipe(
  //     tap((auth: Auth) => {
  //       this.storage.setItem('access_token', auth.access_token);
  //       this.storage.setItem('access_token_stored_at', '' + Date.now());
  //       if (auth.expires_in) {
  //         const expiresInMilliSeconds = auth.expires_in * 1000;
  //         const now = new Date();
  //         const expiresAt = now.getTime() + expiresInMilliSeconds;
  //         this.storage.setItem('expires_at', '' + expiresAt);
  //       }

  //       if (auth.refresh_token) {
  //         this.storage.setItem('refresh_token', auth.refresh_token);
  //       }

  //       this.setAdditionalAuthData(auth);
  //     })
  //   );
  // }
}
