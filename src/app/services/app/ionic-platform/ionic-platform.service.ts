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
}
