import { Logger } from './logger.utils';
import { AngularPlatform } from './platform.utils';

/** Utility class for local storage with static methods */
export class LocalStorage {
  /** Logger */
  private static readonly _logger = new Logger('LocalStorageService');

  /**
   * Set `value` to `localStorage` by `key`.
   * @param key - A key for `value`.
   * @param value - Value to set.
   */
  static set(key: string, value: string): void {
    if (AngularPlatform.isBrowser) {
      if (localStorage) {
        localStorage.setItem(key, value);
      } else {
        this._logger.error('LocalStorage not found');
      }
    }
  }

  /**
   * Get a value from `localStorage` by `key`.
   * @param key - Key to get value.
   * @return Value found by `key`. It there is no value, it returns empty string.
   */
  static get(key: string): string {
    if (AngularPlatform.isBrowser) {
      if (localStorage) {
        return localStorage.getItem(key) || '';
      } else {
        this._logger.error('LocalStorage not found');
      }
    }

    return '';
  }

  /**
   * Remove a value from `localStorage` by `key`.
   * @param key - Key to remove value.
   */
  static remove(key: string): void {
    if (AngularPlatform.isBrowser) {
      if (localStorage) {
        localStorage.removeItem(key);
      } else {
        this._logger.error('LocalStorage not found');
      }
    }
  }
}
