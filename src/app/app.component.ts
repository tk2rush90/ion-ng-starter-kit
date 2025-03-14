import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { AngularPlatform } from './utils/platform.utils';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, FormsModule, IonRouterOutlet],
})
export class AppComponent {
  constructor(private readonly storage: Storage) {
    if (AngularPlatform.isBrowser) {
      this.storage.create();
    }
  }
}
