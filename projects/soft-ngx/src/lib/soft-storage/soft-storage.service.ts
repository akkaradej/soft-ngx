import { Injectable, Inject } from '@angular/core';

import { SoftStorageConfig, defaultConfig } from './soft-storage.config';
import { userSoftStorageConfigToken } from './user-config.token';

@Injectable({
  providedIn: 'root',
})
export class SoftStorageService {

  protected config = {} as Required<SoftStorageConfig>;
  protected storage: Required<Storage>;

  [key: string]: any;
  [index: number]: string;

  constructor(
    @Inject(userSoftStorageConfigToken) userConfig: SoftStorageConfig) {

    this.config = Object.assign({}, defaultConfig, userConfig);
    if (this.config.usePersistentAsDefault) {
      this.usePersistent();
    } else {
      this.useTemporary();
    }
  }

  get length(): number {
    return this.storage.length;
  }

  key(index: number): string | null {
    return this.storage.key(index);
  }

  getItem(key: string): Promise<string | null> {
    return this._getItem(key, this.storage);
  }

  getItemPersistent(key: string): Promise<string | null> {
    return this._getItem(key, this.config.persistentStorage);
  }

  getItemTemporary(key: string): Promise<string | null> {
    return this._getItem(key, this.config.temporaryStorage);
  }

  getItemAny(key: string): Promise<string | null> {
    return this.getItemPersistent(key) || this.getItemTemporary(key);
  }

  getNumber(key: string): Promise<number> {
    return this._getNumber(key, this.storage);
  }

  getNumberPersistent(key: string): Promise<number> {
    return this._getNumber(key, this.config.persistentStorage);
  }

  getNumberTemporary(key: string): Promise<number> {
    return this._getNumber(key, this.config.temporaryStorage);
  }

  getNumberAny(key: string): Promise<number> {
    return this.getNumberPersistent(key) || this.getNumberTemporary(key);
  }

  getBoolean(key: string): Promise<boolean> {
    return this._getBoolean(key, this.storage);
  }

  getBooleanPersistent(key: string): Promise<boolean> {
    return this._getBoolean(key, this.config.persistentStorage);
  }

  getBooleanTemporary(key: string): Promise<boolean> {
    return this._getBoolean(key, this.config.temporaryStorage);
  }

  getBooleanAny(key: string): Promise<boolean> {
    return this.getBooleanPersistent(key) || this.getBooleanTemporary(key);
  }

  setItem(key: string, data: any): Promise<void> {
    return this._setItem(key, data, this.storage);
  }

  setItemPersistent(key: string, data: any): Promise<void> {
    return this._setItem(key, data, this.config.persistentStorage);
  }

  setItemTemporary(key: string, data: any): Promise<void> {
    return this._setItem(key, data, this.config.temporaryStorage);
  }

  removeItem(key: string): Promise<void> {
    return this._removeItem(key, this.storage);
  }

  removeItemPersistent(key: string): Promise<void> {
    return this._removeItem(key, this.config.persistentStorage);
  }

  removeItemTemporary(key: string): Promise<void> {
    return this._removeItem(key, this.config.temporaryStorage);
  }

  async removeItemAny(key: string): Promise<void> {
    await this.removeItemPersistent(key);
    await this.removeItemTemporary(key);
  }

  clear(): Promise<void> {
    return this._clear(this.storage);
  }

  clearPersistent(): Promise<void> {
    return this._clear(this.config.persistentStorage);
  }

  clearTemporary(): Promise<void> {
    return this._clear(this.config.temporaryStorage);
  }

  async clearAll(): Promise<void> {
    await this.clearPersistent();
    await this.clearTemporary();
  }

  usePersistent() {
    this.storage = this.config.persistentStorage;
  }

  useTemporary() {
    this.storage = this.config.temporaryStorage;
  }

  private async _getItem(key: string, storage: Storage): Promise<string | null> {
    return storage.getItem(`${this.config.storagePrefix}${key}`);
  }

  private async _getNumber(key: string, storage: Storage): Promise<number> {
    const value = await this._getItem(key, storage);
    return value === null ? 0 : +value;
  }

  private async _getBoolean(key: string, storage: Storage): Promise<boolean> {
    return await this._getItem(key, storage) === 'true';
  }

  private async _setItem(key: string, data: any, storage: Storage): Promise<void> {
    return storage.setItem(`${this.config.storagePrefix}${key}`, data);
  }

  private async _removeItem(key: string, storage: Storage): Promise<void> {
    return storage.removeItem(`${this.config.storagePrefix}${key}`);
  }

  private async _clear(storage: Storage): Promise<void> {
    return storage.clear();
  }

}
