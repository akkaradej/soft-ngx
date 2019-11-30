import { Injectable } from '@angular/core';
import { AuthServiceBase } from 'soft-ngx';

export enum AuthData {
  email = 'email'
}

@Injectable()
export class AuthService extends AuthServiceBase {

  getAdditionalAuthData() {
    return Object.keys(AuthData);
  }

  get email(): string | null {
    return this.storage.getItem(AuthData.email);
  }
}
