import { Injectable } from '@angular/core';
import { SoftAuthServiceBase } from './soft-auth.service.base';

export enum AuthData {
  email = 'email',
}

@Injectable({
  providedIn: 'root',
})
export class SoftAuthService extends SoftAuthServiceBase {

  getAdditionalAuthData() {
    return Object.keys(AuthData).map(key => AuthData[key]);
  }

  get email(): string | null {
    return this.storage.getItem(AuthData.email);
  }
}
