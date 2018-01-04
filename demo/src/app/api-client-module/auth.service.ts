import { Injectable } from '@angular/core';
import { AuthService as AuthServiceBase } from 'soft-ngx';

@Injectable()
export class AuthService extends AuthServiceBase {

  get isAdmin(): boolean {
    return this.storage.getBoolean('is_admin');
  }

  get userId(): number {
    return this.storage.getNumber('user_id');
  }

  get displayName(): string {
    return this.storage.getItem('display_name');
  }
}