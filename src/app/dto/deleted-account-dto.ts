import { AccountDto } from './account-dto';
import { OauthProvider } from '../types/oauth-provider';

export interface DeletedAccountDto extends AccountDto {
  /** Email */
  email: string;

  /** Oauth provider */
  oauthProvider: OauthProvider | null;

  /** Oauth id */
  oauthId: string | null;
}
