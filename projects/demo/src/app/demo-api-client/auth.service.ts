import { Injectable, Inject } from '@angular/core';
import { SoftAuthServiceBase } from 'soft-ngx';

// // Uncomment for Example below
// import { Inject } from '@angular/core';
// import { Auth, AuthConfig, StorageService, authUserConfigToken } from 'soft-ngx';
// import { HttpClient } from '@angular/common/http';
// import { Observable, config } from 'rxjs';
// import { tap } from 'rxjs/operators';

enum AuthData {
  is_super_admin = 'is_super_admin',
  display_name = 'display_name'
}

interface Can {
  viewTest: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService extends SoftAuthServiceBase { // or implements SoftAuthServiceInterface {

  // // Example: To create constructor
  // constructor(
  //   http: HttpClient,
  //   storage: SoftStorageService,
  //   @Inject(userSoftAuthServiceConfigToken) userConfig: SoftAuthServiceConfig,
  //   @Inject(userSoftAuthRequestKeyToken) userAuthRequestKeyConfig: SoftAuthRequestKey,
  //   @Inject(userSoftAuthResponseKeyToken) userAuthResponseKeyConfig: SoftAuthResponseKey,
  // ) {
  //   super(http, storage, userConfig, userAuthRequestKeyConfig, userAuthResponseKeyConfig);
  // }

  override can: Can;

  override getAdditionalAuthData() {
    return Object.keys(AuthData);
  }

  override setAuthorize() {
    this.can.viewTest = true;
  }

  get isSuperAdmin(): boolean {
    return this.storage.getBoolean(AuthData.is_super_admin);
  }

  get displayName(): string | null {
    return this.storage.getItem(AuthData.display_name);
  }

  // // Example: To post with HttpClient
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
