import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export enum AngularPlatformLocaleType {
  KO = 'ko',
  EN = 'en',
}

@Injectable({
  providedIn: 'root',
})
export class AngularPlatformService {
  locale = signal(AngularPlatformLocaleType.EN);

  private readonly platformId = inject(PLATFORM_ID);

  isPlatformBrowser() {
    return isPlatformBrowser(this.platformId);
  }
}
