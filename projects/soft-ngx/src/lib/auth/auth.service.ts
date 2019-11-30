import { Injectable } from '@angular/core';
import { AuthServiceBase } from './auth.service.base';

export enum AuthData {
  email = 'email'
}

@Injectable()
export class AuthService extends AuthServiceBase {

  getAdditionalAuthData() {
    return Object.keys(AuthData).map(key => AuthData[key]);
  }

  get email(): string | null {
    return this.storage.getItem(AuthData.email);
  }
}
