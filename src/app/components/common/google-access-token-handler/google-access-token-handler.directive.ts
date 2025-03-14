import { Directive } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { StartByGoogleAccessTokenService } from '../../../services/app/start-by-google-access-token/start-by-google-access-token.service';

/** 액세스 토큰 이용한 로그인 처리 */
@Directive({
  selector: '[appGoogleAccessTokenHandler]',
  standalone: true,
  providers: [StartByGoogleAccessTokenService],
})
export class GoogleAccessTokenHandlerDirective {
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly startByGoogleAccessTokenService: StartByGoogleAccessTokenService,
  ) {
    this.activatedRoute.fragment
      .pipe(takeUntilDestroyed())
      .subscribe((fragment) => {
        if (fragment) {
          const urlSearchParams = new URLSearchParams(fragment);

          const error = urlSearchParams.get('error');

          const accessToken = urlSearchParams.get('access_token');

          // todo 에러 이미트, 액세스 토큰 이용한 로그인
        }
      });
  }
}
