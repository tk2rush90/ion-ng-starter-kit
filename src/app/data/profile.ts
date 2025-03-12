export interface Profile {
  /** Account id */
  id: string;

  /** Avatar url */
  avatarUrl: string | null;

  /** Account nickname */
  nickname: string;

  /** Access token */
  accessToken: string;
}
