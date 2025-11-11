import { inject, Injectable } from '@angular/core';
import { Platform } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root',
})
export class IonicPlatformService {
  private readonly platform = inject(Platform);

  isHybrid() {
    return this.platform.is('hybrid');
  }

  isTablet() {
    return this.platform.is('tablet');
  }

  isMobile() {
    return this.platform.is('mobile');
  }
}
