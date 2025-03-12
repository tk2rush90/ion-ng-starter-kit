export interface GoogleRedirectOptions {
  clientId: string;
  redirectUri: string;
  scope?: string[];
  prompt?: 'none' | 'consent' | 'select_account';
  state?: string;
  includeGrantedScopes?: boolean;
  enableGranularConsent?: boolean;
  loginHint?: string;
}
