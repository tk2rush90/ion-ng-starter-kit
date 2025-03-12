import { Component, HostListener } from '@angular/core';
import { IconKakaoComponent } from '../../icons/icon-kakao/icon-kakao.component';
import { Location } from '@angular/common';
import { OauthService } from '../../../services/app/oauth/oauth.service';
import {
  OAUTH_PREVIOUS_URL_KEY,
  OAUTH_STATE_KEY,
} from '../../../constants/storage-keys';
import { environment } from '../../../../environments/environment';
import { Platform } from '../../../utils/platform';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-kakao-oauth-button',
  imports: [IconKakaoComponent],
  templateUrl: './kakao-oauth-button.component.html',
  styleUrl: './kakao-oauth-button.component.scss',
  host: {
    class: 'flat-button gap-2 kakao',
    type: 'button',
    role: 'button',
  },
})
export class KakaoOauthButtonComponent {
  constructor(
    private readonly location: Location,
    private readonly oauthService: OauthService,
    private readonly storage: Storage,
  ) {}

  @HostListener('click')
  async onHostClick(): Promise<void> {
    const state = crypto.randomUUID();

    await this.storage.set(OAUTH_STATE_KEY, state);
    await this.storage.set(OAUTH_PREVIOUS_URL_KEY, this.location.path(true));

    this.oauthService.getKakaoCode({
      clientId: environment.kakao.clientId,
      redirectUri: Platform.isApp
        ? environment.kakao.appRedirectUri
        : environment.kakao.redirectUri,
      state,
    });
  }
}
