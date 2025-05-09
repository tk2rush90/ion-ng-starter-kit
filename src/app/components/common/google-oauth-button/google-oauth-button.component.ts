import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { IconGoogleLogoComponent } from '../../icons/icon-google-logo/icon-google-logo.component';
import { OAUTH_PREVIOUS_URL_KEY } from '../../../constants/storage-keys';
import { Location } from '@angular/common';
import { Storage } from '@ionic/storage';
import { GoogleOauth } from '../../../plugins/google-oauth-plugin';
import { Platform } from '@ionic/angular/standalone';
import { GoogleIdTokenPayloadDto } from '../../../dto/google-id-token-payload-dto';
import { StartByGoogleIdTokenService } from '../../../services/app/start-by-google-id-token/start-by-google-id-token.service';
import { StartByGoogleAccessTokenService } from '../../../services/app/start-by-google-access-token/start-by-google-access-token.service';
import { SignedMemberService } from '../../../services/app/signed-member/signed-member.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastService } from '../../../services/app/toast/toast.service';
import { AngularPlatform } from '../../../utils/platform.utils';
import TokenResponse = google.accounts.oauth2.TokenResponse;

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
  providers: [StartByGoogleIdTokenService, StartByGoogleAccessTokenService],
})
export class GoogleOauthButtonComponent {
  @Output() loginSuccess = new EventEmitter<void>();

  constructor(
    private readonly location: Location,
    private readonly storage: Storage,
    private readonly platform: Platform,
    private readonly startByGoogleIdTokenService: StartByGoogleIdTokenService,
    private readonly startByGoogleAccessTokenService: StartByGoogleAccessTokenService,
    private readonly signedMemberService: SignedMemberService,
    private readonly toastService: ToastService,
  ) {
    this.startByGoogleIdTokenService.created
      .pipe(takeUntilDestroyed())
      .subscribe((member) => {
        this.signedMemberService.member = member;
        this.loginSuccess.emit();
      });

    this.startByGoogleAccessTokenService.created
      .pipe(takeUntilDestroyed())
      .subscribe((member) => {
        this.signedMemberService.member = member;
        this.loginSuccess.emit();
      });

    this.startByGoogleIdTokenService.createFailed
      .pipe(takeUntilDestroyed())
      .subscribe((err) => {
        this.toastService.open({
          message: err.error[AngularPlatform.locale],
        });
      });

    this.startByGoogleAccessTokenService.createFailed
      .pipe(takeUntilDestroyed())
      .subscribe((err) => {
        this.toastService.open({
          message: err.error[AngularPlatform.locale],
        });
      });
  }

  @HostListener('click')
  async onHostClick(): Promise<void> {
    await this.storage.set(OAUTH_PREVIOUS_URL_KEY, this.location.path(true));

    if (this.platform.is('hybrid')) {
      const payload = (await GoogleOauth.signIn()) as GoogleIdTokenPayloadDto;

      this.startByGoogleIdTokenService.create({
        idToken: payload.idToken,
      });
    } else {
      const response = (await GoogleOauth.signIn()) as TokenResponse;

      this.startByGoogleAccessTokenService.create({
        accessToken: response.access_token,
      });
    }
  }
}
