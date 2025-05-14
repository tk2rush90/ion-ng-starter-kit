import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { AngularPlatform } from './utils/platform.utils';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, FormsModule, IonRouterOutlet, RouterOutlet],
})
export class AppComponent {
  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: object,
    private readonly storage: Storage,
  ) {
    AngularPlatform.setPlatformId(this.platformId);

    if (AngularPlatform.isBrowser) {
      this.storage.create();
    }
  }
}
