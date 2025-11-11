import { inject, Injectable } from '@angular/core';
import { AngularPlatformService } from '../angular-platform/angular-platform.service';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private readonly angularPlatformService = inject(AngularPlatformService);

  set(key: string, value: string) {
    if (this.angularPlatformService.isPlatformBrowser()) {
      if (localStorage) {
        localStorage.setItem(key, value);

        return;
      }

      console.warn(
        `로컬 스토리지를 찾을 수 없습니다. ${key}의 값을 저장하지 못했습니다.`,
      );

      return;
    }

    console.warn(
      `${key}의 값을 저장하지 못했습니다. 클라이언트에서만 처리 가능합니다.`,
    );
  }

  get(key: string) {
    if (this.angularPlatformService.isPlatformBrowser()) {
      if (localStorage) {
        const value = localStorage.getItem(key);

        if (value === null) {
          return null;
        }

        return JSON.parse(value);
      }

      console.warn(
        `로컬 스토리지를 찾을 수 없습니다. ${key}의 값을 가져오지 못했습니다.`,
      );

      return null;
    }

    console.warn(
      `${key}의 값을 가져오지 못했습니다. 클라이언트에서만 처리 가능합니다.`,
    );

    return null;
  }

  remove(key: string) {
    if (this.angularPlatformService.isPlatformBrowser()) {
      if (localStorage) {
        localStorage.removeItem(key);

        return;
      }

      console.warn(
        `로컬 스토리지를 찾을 수 없습니다. ${key}의 값을 삭제하지 못했습니다.`,
      );

      return;
    }

    console.warn(
      `${key}의 값을 삭제하지 못했습니다. 클라이언트에서만 처리 가능합니다.`,
    );
  }
}
