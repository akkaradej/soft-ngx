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

  length(): number {
    return this.storage.length;
  }

  key(index: number): string | null {
    return this.storage.key(index);
  }

  keys(): string[] {
    return Object.keys(this.storage);
  }

  getItem(key: string): string | null {
    return this._getItem(key, this.storage);
  }

  getItemPersistent(key: string): string | null {
    return this._getItem(key, this.config.persistentStorage);
  }

  getItemTemporary(key: string): string | null {
    return this._getItem(key, this.config.temporaryStorage);
  }

  getItemAny(key: string): string | null {
    return this.getItemPersistent(key) || this.getItemTemporary(key);
  }

  getNumber(key: string): number {
    return this._getNumber(key, this.storage);
  }

  getNumberPersistent(key: string): number {
    return this._getNumber(key, this.config.persistentStorage);
  }

  getNumberTemporary(key: string): number {
    return this._getNumber(key, this.config.temporaryStorage);
  }

  getNumberAny(key: string): number {
    return this.getNumberPersistent(key) || this.getNumberTemporary(key);
  }

  getBoolean(key: string): boolean {
    return this._getBoolean(key, this.storage);
  }

  getBooleanPersistent(key: string): boolean {
    return this._getBoolean(key, this.config.persistentStorage);
  }

  getBooleanTemporary(key: string): boolean {
    return this._getBoolean(key, this.config.temporaryStorage);
  }

  getBooleanAny(key: string): boolean {
    return this.getBooleanPersistent(key) || this.getBooleanTemporary(key);
  }

  setItem(key: string, data: any): void {
    return this._setItem(key, data, this.storage);
  }

  setItemPersistent(key: string, data: any): void {
    return this._setItem(key, data, this.config.persistentStorage);
  }

  setItemTemporary(key: string, data: any): void {
    return this._setItem(key, data, this.config.temporaryStorage);
  }

  removeItem(key: string): void {
    return this._removeItem(key, this.storage);
  }

  removeItemPersistent(key: string): void {
    return this._removeItem(key, this.config.persistentStorage);
  }

  removeItemTemporary(key: string): void {
    return this._removeItem(key, this.config.temporaryStorage);
  }

  removeItemAny(key: string): void {
    this.removeItemPersistent(key);
    this.removeItemTemporary(key);
  }

  removeItemByPrefix(prefix: string): void {
    return this._removeItemฺByPrefix(prefix, this.storage);
  }

  removeItemPersistentByPrefix(prefix: string): void {
    return this._removeItemฺByPrefix(prefix, this.config.persistentStorage);
  }

  removeItemTemporaryByPrefix(prefix: string): void {
    return this._removeItemฺByPrefix(prefix, this.config.temporaryStorage);
  }

  removeItemAnyByPrefix(prefix: string): void {
    this.removeItemPersistentByPrefix(prefix);
    this.removeItemTemporaryByPrefix(prefix);
  }

  clear(): void {
    return this._clear(this.storage);
  }

  clearPersistent(): void {
    return this._clear(this.config.persistentStorage);
  }

  clearTemporary(): void {
    return this._clear(this.config.temporaryStorage);
  }

  clearAll(): void {
    this.clearPersistent();
    this.clearTemporary();
  }

  usePersistent() {
    this.storage = this.config.persistentStorage;
  }

  useTemporary() {
    this.storage = this.config.temporaryStorage;
  }

  private _getItem(key: string, storage: Storage): string | null {
    return storage.getItem(`${this.config.storagePrefix}${key}`);
  }

  private _getNumber(key: string, storage: Storage): number {
    const value = this._getItem(key, storage);
    return value === null ? 0 : +value;
  }

  private _getBoolean(key: string, storage: Storage): boolean {
    return this._getItem(key, storage) === 'true';
  }

  private _setItem(key: string, data: any, storage: Storage): void {
    return storage.setItem(`${this.config.storagePrefix}${key}`, data);
  }

  private _removeItem(key: string, storage: Storage): void {
    return storage.removeItem(`${this.config.storagePrefix}${key}`);
  }

  private _removeItemฺByPrefix(prefix: string, storage: Storage): void {
    Object.keys(storage)
      .filter(x => x.startsWith(`${this.config.storagePrefix}${prefix}`))
      .forEach(x => storage.removeItem(x));
  }

  private _clear(storage: Storage): void {
    return storage.clear();
  }

}
