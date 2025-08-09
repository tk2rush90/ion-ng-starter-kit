import { Component, HostListener, inject, output } from '@angular/core';
import { IconGoogleSymbolComponent } from '../../icons/icon-google-symbol/icon-google-symbol.component';
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
import { AngularPlatform } from '../../../utils/platform.utils';
import { ButtonDirective } from '../button/button.directive';
import { environment } from '../../../../environments/environment';
import TokenResponse = google.accounts.oauth2.TokenResponse;

@Component({
  selector: 'app-google-oauth-button',
  imports: [IconGoogleSymbolComponent],
  templateUrl: './google-oauth-button.component.html',
  styleUrl: './google-oauth-button.component.scss',
  host: {
    type: 'button',
    role: 'button',
    tabindex: '0',
  },
  providers: [StartByGoogleIdTokenService, StartByGoogleAccessTokenService],
  hostDirectives: [
    {
      directive: ButtonDirective,
      inputs: ['theme', 'size', 'mode'],
    },
  ],
})
export class GoogleOauthButtonComponent {
  loginSuccess = output();

  loginError = output<string>();

  private readonly location = inject(Location);

  private readonly storage = inject(Storage);

  private readonly platform = inject(Platform);

  private readonly startByGoogleIdTokenService = inject(
    StartByGoogleIdTokenService,
  );

  private readonly startByGoogleAccessTokenService = inject(
    StartByGoogleAccessTokenService,
  );

  private readonly signedMemberService = inject(SignedMemberService);

  constructor() {
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
      .subscribe((err) =>
        this.loginError.emit(err.error[AngularPlatform.locale]),
      );

    this.startByGoogleAccessTokenService.createFailed
      .pipe(takeUntilDestroyed())
      .subscribe((err) =>
        this.loginError.emit(err.error[AngularPlatform.locale]),
      );
  }

  @HostListener('click')
  async onHostClick(): Promise<void> {
    await this.storage.set(OAUTH_PREVIOUS_URL_KEY, this.location.path(true));

    if (this.platform.is('hybrid')) {
      const payload = (await GoogleOauth.signIn({
        clientId: environment.google.clientId,
      })) as GoogleIdTokenPayloadDto;

      this.startByGoogleIdTokenService.create({
        idToken: payload.idToken,
      });
    } else {
      const response = (await GoogleOauth.signIn({
        clientId: environment.google.clientId,
      })) as TokenResponse;

      this.startByGoogleAccessTokenService.create({
        accessToken: response.access_token,
      });
    }
  }
}
