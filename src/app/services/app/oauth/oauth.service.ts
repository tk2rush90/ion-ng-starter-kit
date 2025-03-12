import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { GoogleRedirectOptions } from '../../../data/google-redirect-options';
import { KakaoRedirectOptions } from '../../../data/kakao-redirect-options';

@Injectable({
  providedIn: 'root',
})
export class OauthService {
  getGoogleAccessToken(options: GoogleRedirectOptions): void {
    location.href = this.getGoogleOAuthUrl(options);
  }

  getKakaoCode(options: KakaoRedirectOptions): void {
    location.href = this.getKakaoOAuthUrl(options);
  }

  getGoogleOAuthUrl({
    clientId,
    redirectUri,
    scope = ['email', 'profile'],
    prompt,
    state,
    includeGrantedScopes,
    enableGranularConsent,
    loginHint,
  }: GoogleRedirectOptions): string {
    const url = new URL(environment.host.googleOauth2);

    url.searchParams.set('client_id', clientId);
    url.searchParams.set('redirect_uri', redirectUri);
    url.searchParams.set('response_type', 'token');
    url.searchParams.set('scope', scope.join(' '));

    if (prompt !== undefined) {
      url.searchParams.set('prompt', prompt);
    }

    if (includeGrantedScopes !== undefined) {
      url.searchParams.set(
        'include_granted_scopes',
        String(includeGrantedScopes),
      );
    }

    if (enableGranularConsent !== undefined) {
      url.searchParams.set(
        'enable_granular_consent',
        String(enableGranularConsent),
      );
    }

    if (loginHint !== undefined) {
      url.searchParams.set('login_hint', loginHint);
    }

    if (state !== undefined) {
      url.searchParams.set('state', state);
    }

    return url.toString();
  }

  getKakaoOAuthUrl({
    clientId,
    redirectUri,
    scope = ['openid'],
    prompt,
    loginHint,
    serviceTerms,
    state,
    nonce,
  }: KakaoRedirectOptions): string {
    const url = new URL(environment.host.kakaoOauth2);

    url.searchParams.set('client_id', clientId);
    url.searchParams.set('redirect_uri', redirectUri);
    url.searchParams.set('response_type', 'code');

    if (scope?.length > 0) {
      url.searchParams.set('scope', scope.join(','));
    }

    if (prompt !== undefined) {
      url.searchParams.set('prompt', prompt);
    }

    if (loginHint !== undefined) {
      url.searchParams.set('login_hint', loginHint);
    }

    if (serviceTerms !== undefined) {
      url.searchParams.set('service_terms', serviceTerms);
    }

    if (state !== undefined) {
      url.searchParams.set('state', state);
    }

    if (nonce !== undefined) {
      url.searchParams.set('nonce', nonce);
    }

    return url.toString();
  }
}
