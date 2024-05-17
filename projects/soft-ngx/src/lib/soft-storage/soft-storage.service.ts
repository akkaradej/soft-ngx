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

  async length(): Promise<number> {
    return this.storage.length;
  }

  async key(index: number): Promise<string | null> {
    return this.storage.key(index);
  }

  async keys(index: number): Promise<string[]> {
    return Object.keys(this.storage);
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

  removeItemByPrefix(prefix: string): Promise<void> {
    return this._removeItemฺByPrefix(prefix, this.storage);
  }

  removeItemPersistentByPrefix(prefix: string): Promise<void> {
    return this._removeItemฺByPrefix(prefix, this.config.persistentStorage);
  }

  removeItemTemporaryByPrefix(prefix: string): Promise<void> {
    return this._removeItemฺByPrefix(prefix, this.config.temporaryStorage);
  }

  async removeItemAnyByPrefix(prefix: string): Promise<void> {
    await this.removeItemPersistentByPrefix(prefix);
    await this.removeItemTemporaryByPrefix(prefix);
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

  private async _removeItemฺByPrefix(prefix: string, storage: Storage): Promise<void> {
    Object.keys(storage)
      .filter(x => x.startsWith(`${this.config.storagePrefix}${prefix}`))
      .forEach(x => storage.removeItem(x));
  }

  private async _clear(storage: Storage): Promise<void> {
    return storage.clear();
  }

}
