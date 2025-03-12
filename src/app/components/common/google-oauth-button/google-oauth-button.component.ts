import { Component, HostListener } from '@angular/core';
import { IconGoogleLogoComponent } from '../../icons/icon-google-logo/icon-google-logo.component';
import { OauthService } from '../../../services/app/oauth/oauth.service';
import { environment } from '../../../../environments/environment';
import {
  OAUTH_PREVIOUS_URL_KEY,
  OAUTH_STATE_KEY,
} from '../../../constants/storage-keys';
import { Location } from '@angular/common';
import { Platform } from '../../../utils/platform';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-google-oauth-button',
  imports: [IconGoogleLogoComponent],
  templateUrl: './google-oauth-button.component.html',
  styleUrl: './google-oauth-button.component.scss',
  host: {
    class: 'stroke-button gap-2',
    type: 'button',
    role: 'button',
  },
})
export class GoogleOauthButtonComponent {
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

    this.oauthService.getGoogleAccessToken({
      clientId: environment.google.clientId,
      redirectUri: Platform.isApp
        ? environment.google.appRedirectUri
        : environment.google.redirectUri,
      state,
    });
  }
}
