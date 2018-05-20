import { Injectable } from '@angular/core';
import { AuthService, AuthServiceInterface } from 'soft-ngx';

@Injectable()
export class CustomAuthService extends AuthService implements AuthServiceInterface {

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