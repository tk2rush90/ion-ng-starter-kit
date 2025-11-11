import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AngularPlatformService {
  private readonly platformId = inject(PLATFORM_ID);

  isPlatformBrowser() {
    return isPlatformBrowser(this.platformId);
  }
}
