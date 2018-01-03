import { Injectable } from '@angular/core';

import { StorageService } from './storage.service';

@Injectable()
export class AuthHelperService {
  constructor(
    private storage: StorageService) {
  }

  // get isAdmin(): boolean {
  //   return this.storage.getBoolean('isAdmin');
  // }

  // get userId(): string | null {
  //   return this.storage.getItem('userId');
  // }

  setAdditionalAuthData(auth: any) {
    // this.storage.setItem('isAdmin', auth.is_admin);
    // this.storage.setItem('userId', auth.user_id);
  }

  removeAdditionalAuthData() {
    // this.storage.removeItem('isAdmin');
    // this.storage.removeItem('userId');
  }

}