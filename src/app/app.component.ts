import { Component, inject, PLATFORM_ID } from '@angular/core';
import { IonApp } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { AngularPlatform } from './utils/platform.utils';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, FormsModule, RouterOutlet],
})
export class AppComponent {
  private readonly platformId = inject(PLATFORM_ID);

  private readonly storage = inject(Storage);

  constructor() {
    AngularPlatform.setPlatformId(this.platformId);

    if (AngularPlatform.isBrowser) {
      this.storage.create();
    }
  }
}
