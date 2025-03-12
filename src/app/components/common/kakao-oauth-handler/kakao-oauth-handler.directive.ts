import { Directive } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LocalStorageUtil } from '../../../utils/local-storage-util';
import { OAUTH_STATE_KEY } from '../../../constants/storage-keys';
import { BaseOauthHandlerDirective } from '../base-oauth-handler/base-oauth-handler.directive';
import { Platform } from '../../../utils/platform';
import { environment } from '../../../../environments/environment';

@Directive({
  selector: '[appKakaoOauthHandler]',
  standalone: true,
})
export class KakaoOauthHandlerDirective extends BaseOauthHandlerDirective {
  constructor() {
    super();
  }

  override handleOauthParameters(): void {
    this.activatedRoute.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((paramMap) => {
        const error = paramMap.get('error');

        if (error) {
          this.oauthError.emit(error);
          return;
        }

        const state = paramMap.get('state');

        // when `state` specified, check it
        if (state && LocalStorageUtil.get(OAUTH_STATE_KEY) !== state) {
          this.invalidState.emit();
          return;
        }

        const code = paramMap.get('code');

        if (code) {
          this.authService.startByKakao({
            code,
            redirectUri: Platform.isApp
              ? environment.kakao.appRedirectUri
              : environment.kakao.redirectUri,
          });
        }
      });
  }
}
