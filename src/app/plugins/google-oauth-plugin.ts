import { registerPlugin } from '@capacitor/core';
import { GoogleIdTokenPayloadDto } from '../dto/google-id-token-payload-dto';
import TokenResponse = google.accounts.oauth2.TokenResponse;

export interface GoogleOauthPlugin {
  signIn(options: {
    clientId: string;
  }): Promise<TokenResponse> | Promise<GoogleIdTokenPayloadDto>;
}

export class GoogleOAuthPluginWeb implements GoogleOauthPlugin {
  signIn({ clientId }: { clientId: string }): Promise<TokenResponse> {
    return new Promise<TokenResponse>((resolve) => {
      const client = google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'profile openid email',
        callback: (response) => resolve(response),
      });

      client.requestAccessToken();
    });
  }
}

export const GoogleOauth = registerPlugin<GoogleOauthPlugin>('GoogleOauth', {
  web: () => new GoogleOAuthPluginWeb(),
});
