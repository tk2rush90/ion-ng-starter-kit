import { Injectable } from '@angular/core';
import { ApiService } from '../api-service';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Login } from '../../../data/login';
import { Account } from '../../../data/account';
import { Join } from '../../../data/join';
import { Profile } from '../../../data/profile';
import { Email } from '../../../data/email';
import { HttpParams } from '@angular/common/http';
import { Nickname } from '../../../data/nickname';
import { DeletedAccount } from '../../../data/deleted-account';
import { StartByKakao } from '../../../data/start-by-kakao';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService extends ApiService {
  constructor() {
    super(environment.host.backend + '/auth');
  }

  /**
   * Check email duplicated.
   * @param email
   */
  checkEmailDuplicated({ email }: Email): Observable<void> {
    return this._http.get<void>(this.host + '/check/email', {
      params: new HttpParams({
        fromObject: {
          email,
        },
      }),
    });
  }

  /**
   * Check nickname duplicated.
   * @param nickname
   */
  checkNicknameDuplicated({ nickname }: Nickname): Observable<void> {
    return this._http.get<void>(this.host + '/check/nickname', {
      params: new HttpParams({
        fromObject: {
          nickname,
        },
      }),
    });
  }

  /**
   * Create account.
   * @param email
   * @param nickname
   */
  join({ email, nickname }: Join): Observable<Account> {
    return this._http.post<Account>(this.host + '/join', {
      email,
      nickname,
    });
  }

  /**
   * Login.
   * @param email
   * @param otp
   */
  login({ email, otp }: Login): Observable<Profile> {
    return this._http.post<Profile>(this.host + '/login', {
      email,
      otp,
    });
  }

  /** Login with saved access token */
  autoLogin(): Observable<Profile> {
    return this._http.post<Profile>(this.host + '/login/auto', {});
  }

  /** Logout */
  logout(): Observable<void> {
    return this._http.post<void>(this.host + '/logout', {});
  }

  startByGoogle(accessToken: string): Observable<Profile> {
    return this._http.post<Profile>(this.host + '/start/google', {
      accessToken,
    });
  }

  startByKakao(body: StartByKakao): Observable<Profile> {
    return this._http.post<Profile>(this.host + '/start/kakao', body);
  }

  /** Delete account */
  deleteAccount(): Observable<DeletedAccount> {
    return this._http.post<DeletedAccount>(this.host + '/account/delete', {});
  }
}
