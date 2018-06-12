import { Injectable, Inject } from '@angular/core';

import { StorageConfig, defaultConfig } from './storage.config';
import { userConfigToken } from './user-config.token';

@Injectable()
export class StorageService implements Storage {

  config = {} as StorageConfig;
  storage: Storage;

  [key: string]: any;
  [index: number]: string;

  constructor(
    @Inject(userConfigToken) userConfig: StorageConfig) {

    this.config = Object.assign({}, defaultConfig, userConfig);
    this.storage = this.config.storageType as Storage;
  }

  get length(): number {
    return this.storage.length;
  }

  clear(): void {
    this.storage.clear();
  }

  key(index: number): string | null {
    return this.storage.key(index);
  }

  getItem(key: string): string | null {
    return this.storage.getItem(`${this.config.storagePrefix}${key}`);
  }

  getNumber(key: string): number {
    let value = this.getItem(key);
    return value === null ? 0 : +value;
  }

  getBoolean(key: string): boolean {
    return this.getItem(key) == 'true';
  }

  setItem(key: string, data: any): void {
    return this.storage.setItem(`${this.config.storagePrefix}${key}`, data);
  }

  removeItem(key: string): void {
    return this.storage.removeItem(`${this.config.storagePrefix}${key}`);
  }

}
