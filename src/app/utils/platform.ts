import UAParser, { IBrowser, IDevice, IOS } from 'ua-parser-js';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';

export const isServer = (): boolean => {
  return isPlatformServer(inject(PLATFORM_ID));
};

export const isBrowser = (): boolean => {
  return isPlatformBrowser(inject(PLATFORM_ID));
};

/**
 * A class to detect about platform specification
 * @deprecated
 */
export class Platform {
  /** User agent parser */
  private static _parser = new UAParser();

  /** Platform id */
  private static _platformId: Object;

  /** Set platform id */
  static setPlatformId(platformId: Object): void {
    this._platformId = platformId;
  }

  /** Get status whether platform is browser or not */
  static get isBrowser(): boolean {
    return isPlatformBrowser(this._platformId);
  }

  /** Get status of whether platform is server or not */
  static get isServer(): boolean {
    return isPlatformServer(this._platformId);
  }

  /** Get status of whether OS is created by Apple, inc. or not */
  static get isApple(): boolean {
    return this.os.name === 'iOS' || this.os.name === 'Mac OS';
  }

  /** Get status of whether device is mobile or not */
  static get isMobile(): boolean {
    return this.device.type === 'mobile';
  }

  static get isTablet(): boolean {
    return this.device.type === 'tablet';
  }

  /** Get OS information from UA */
  static get os(): IOS {
    return this._parser.getOS();
  }

  /** Get browser information from UA */
  static get browser(): IBrowser {
    return this._parser.getBrowser();
  }

  /** Get device information from UA */
  static get device(): IDevice {
    return this._parser.getDevice();
  }

  static get isApp(): boolean {
    return false;
  }

  static reloadParser(): void {
    this._parser = new UAParser();
  }
}
