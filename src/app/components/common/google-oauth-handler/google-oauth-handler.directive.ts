import { Directive } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LocalStorageUtil } from '../../../utils/local-storage-util';
import { OAUTH_STATE_KEY } from '../../../constants/storage-keys';
import { BaseOauthHandlerDirective } from '../base-oauth-handler/base-oauth-handler.directive';

/** Handles access token retrieved by Google oauth to join or login to App */
@Directive({
  selector: '[appGoogleOauthHandler]',
  standalone: true,
})
export class GoogleOauthHandlerDirective extends BaseOauthHandlerDirective {
  constructor() {
    super();
  }

  override handleOauthParameters(): void {
    this.activatedRoute.fragment
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((fragment) => {
        if (fragment) {
          const urlSearchParams = new URLSearchParams(fragment);

          const error = urlSearchParams.get('error');

          if (error) {
            this.oauthError.emit(error);
            return;
          }

          const state = urlSearchParams.get('state');

          // when `state` specified, check it
          if (state && LocalStorageUtil.get(OAUTH_STATE_KEY) !== state) {
            this.invalidState.emit();
            return;
          }

          const accessToken = urlSearchParams.get('access_token');

          if (accessToken) {
            this.authService.startByGoogle(accessToken);
          }
        }
      });
  }
}
