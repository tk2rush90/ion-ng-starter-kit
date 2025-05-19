import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { IonApp } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { AngularPlatform } from './utils/platform.utils';
import { RouterOutlet } from '@angular/router';
import { ProfileAvatarService } from './services/app/profile-avatar/profile-avatar.service';
import { pickOne } from './utils/array.utils';
import { AVATARS } from './constants/avatars';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, FormsModule, RouterOutlet],
})
export class AppComponent {
  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: object,
    private readonly storage: Storage,
    private readonly profileAvatarService: ProfileAvatarService,
  ) {
    AngularPlatform.setPlatformId(this.platformId);

    if (AngularPlatform.isBrowser) {
      this.storage.create();

      // 로그인 한 사용자를 위해 사용될 아바타 설정
      this.profileAvatarService.data = pickOne(AVATARS);
    }
  }
}
