import { Account } from './account';
import { OauthProvider } from '../types/oauth-provider';

export interface DeletedAccount extends Account {
  /** Email */
  email: string;

  /** Oauth provider */
  oauthProvider: OauthProvider | null;

  /** Oauth id */
  oauthId: string | null;
}
