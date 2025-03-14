import { Injectable } from '@angular/core';
import { ApiService } from '../api-service';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { MemberDto } from '../../../dto/member-dto';
import { IdTokenRequestDto } from '../../../dto/id-token-request-dto';
import { AccessTokenRequestDto } from '../../../dto/access-token-request-dto';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService extends ApiService {
  constructor() {
    super(environment.host.backend + '/auth');
  }

  startByGoogleIdToken(body: IdTokenRequestDto): Observable<MemberDto> {
    return this._http.post<MemberDto>(
      this.host + '/start/google/idToken',
      body,
    );
  }

  startByGoogleAccessToken(body: AccessTokenRequestDto): Observable<MemberDto> {
    return this._http.post<MemberDto>(
      this.host + '/start/google/accessToken',
      body,
    );
  }

  /** Logout */
  logout(): Observable<void> {
    return this._http.post<void>(this.host + '/logout', {});
  }

  /** Delete account */
  deleteAccount(): Observable<void> {
    return this._http.post<void>(this.host + '/account/delete', {});
  }
}
