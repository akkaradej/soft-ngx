import { Injectable } from '@angular/core';
import { StorageService } from 'soft-ngx';
import { Auth } from '../types/auth';

@Injectable()
export class AuthHelperService {
  constructor(
    private storage: StorageService) {
  }

  get isAdmin(): boolean {
    return this.storage.getBoolean('isAdmin');
  }

  get userId(): string | null {
    return this.storage.getItem('userId');
  }

  get displayName(): string | null {
    return this.storage.getItem('displayName');
  }

  setAdditionalAuthData(auth: Auth) {
    this.storage.setItem('isAdmin', auth.is_admin);
    this.storage.setItem('userId', auth.user_id);
    this.storage.setItem('displayName', auth.display_name);
  }

  removeAdditionalAuthData() {
    this.storage.removeItem('isAdmin');
    this.storage.removeItem('userId');
    this.storage.removeItem('displayName');
  }
}