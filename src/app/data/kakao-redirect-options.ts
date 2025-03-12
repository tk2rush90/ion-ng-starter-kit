export interface KakaoRedirectOptions {
  clientId: string;
  redirectUri: string;
  scope?: string[];
  prompt?: string;
  loginHint?: string;
  serviceTerms?: string;
  state?: string;
  nonce?: string;
}
