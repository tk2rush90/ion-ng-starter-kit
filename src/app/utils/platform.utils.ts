import { UAParser } from 'ua-parser-js';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

/**
 * `AppComponent`에서 반드시 최초 `setPlatformId()` 호출 필요. `inject(PLATFORM_ID)`는 Injection context에 있을 때만
 * 가능하기 때문에 모든 상황에서 사용 가능하게 클래스 static getter로 관리
 */
export class AngularPlatform {
  private static platformId: any;

  private static _locale = 'ko';

  static get isServer(): boolean {
    return isPlatformServer(this.platformId);
  }

  static get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  static get locale(): string {
    return this._locale;
  }

  static setPlatformId(platformId: any) {
    this.platformId = platformId;
  }

  static setLocale(locale: string) {
    this._locale = locale || 'ko';
  }
}

export const isMac = (): boolean => {
  const parser = new UAParser();

  return parser.getOS().name === 'macOS';
};
