import { EventEmitter, Injectable } from '@angular/core';
import { AuthApiService } from '../../api/auth-api/auth-api.service';
import { LocalStorageUtil } from '../../../utils/local-storage-util';
import { ACCESS_TOKEN_KEY } from '../../../constants/storage-keys';
import { BehaviorSubject, finalize, takeUntil } from 'rxjs';
import { Profile } from '../../../data/profile';
import { HttpErrorResponse } from '@angular/common/http';
import { DeletedAccount } from '../../../data/deleted-account';
import { StartByKakao } from '../../../data/start-by-kakao';

/** @deprecated 세부 서비스로 분할 예정 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  startLoading$ = new BehaviorSubject(false);

  loginLoading$ = new BehaviorSubject(false);

  logoutLoading$ = new BehaviorSubject(false);

  deleteLoading$ = new BehaviorSubject(false);

  started = new EventEmitter<Profile>();

  loggedIn = new EventEmitter<Profile>();

  loggedOut = new EventEmitter<void>();

  accountDeleted = new EventEmitter<DeletedAccount>();

  startFailed = new EventEmitter<HttpErrorResponse>();

  loginFailed = new EventEmitter<HttpErrorResponse>();

  logoutFailed = new EventEmitter<HttpErrorResponse>();

  deleteFailed = new EventEmitter<HttpErrorResponse>();

  signedProfile$ = new BehaviorSubject<Profile | null>(null);

  signChecked$ = new BehaviorSubject(false);

  private cancelStartEmitter = new EventEmitter<void>();

  private cancelLoginEmitter = new EventEmitter<void>();

  private cancelLogoutEmitter = new EventEmitter<void>();

  private cancelDeleteAccountEmitter = new EventEmitter<void>();

  constructor(private readonly authApiService: AuthApiService) {}

  get accessToken(): string {
    return LocalStorageUtil.get(ACCESS_TOKEN_KEY);
  }

  set accessToken(value: string) {
    LocalStorageUtil.set(ACCESS_TOKEN_KEY, value);
  }

  get startLoading(): boolean {
    return this.startLoading$.value;
  }

  set startLoading(value: boolean) {
    this.startLoading$.next(value);
  }

  get loginLoading(): boolean {
    return this.loginLoading$.value;
  }

  set loginLoading(value: boolean) {
    this.loginLoading$.next(value);
  }

  get logoutLoading(): boolean {
    return this.logoutLoading$.value;
  }

  set logoutLoading(value: boolean) {
    this.logoutLoading$.next(value);
  }

  get deleteLoading(): boolean {
    return this.deleteLoading$.value;
  }

  set deleteLoading(value: boolean) {
    this.deleteLoading$.next(value);
  }

  get signedProfile(): Profile | null {
    return this.signedProfile$.value;
  }

  set signedProfile(signedProfile: Profile | null) {
    this.signedProfile$.next(signedProfile);
  }

  get signChecked(): boolean {
    return this.signChecked$.value;
  }

  set signChecked(value: boolean) {
    this.signChecked$.next(value);
  }

  /** Auto login */
  autoLogin(): void {
    if (this.loginLoading) {
      return;
    }

    this.loginLoading = true;

    this.authApiService
      .autoLogin()
      .pipe(takeUntil(this.cancelLoginEmitter))
      .pipe(finalize(() => (this.loginLoading = false)))
      .subscribe({
        next: (profile) => this.onLogin(profile),
        error: (err: HttpErrorResponse) => this.onLoginFailed(err),
      });
  }

  /** Logout */
  logout(): void {
    if (this.logoutLoading) {
      return;
    }

    this.logoutLoading = true;

    this.authApiService
      .logout()
      .pipe(takeUntil(this.cancelLogoutEmitter))
      .pipe(
        finalize(() => {
          this.logoutLoading = false;
          this.signedProfile = null;
          this.accessToken = '';
        }),
      )
      .subscribe({
        next: () => this.loggedOut.emit(),
        error: (err: HttpErrorResponse) => this.logoutFailed.emit(err),
      });
  }

  startByGoogle(accessToken: string): void {
    if (this.startLoading) {
      return;
    }

    this.startLoading = true;

    this.authApiService
      .startByGoogle(accessToken)
      .pipe(takeUntil(this.cancelStartEmitter))
      .pipe(finalize(() => (this.startLoading = false)))
      .subscribe({
        next: (profile) => {
          this.signedProfile = profile;
          this.accessToken = profile.accessToken;
          this.signChecked = true;
          this.started.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.signedProfile = null;
          this.accessToken = '';
          this.startFailed.emit(err);
        },
      });
  }

  startByKakao(body: StartByKakao): void {
    if (this.startLoading) {
      return;
    }

    this.startLoading = true;

    this.authApiService
      .startByKakao(body)
      .pipe(takeUntil(this.cancelStartEmitter))
      .pipe(finalize(() => (this.startLoading = false)))
      .subscribe({
        next: (profile) => {
          this.signedProfile = profile;
          this.accessToken = profile.accessToken;
          this.signChecked = true;
          this.started.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.signedProfile = null;
          this.accessToken = '';
          this.startFailed.emit(err);
        },
      });
  }

  /** Delete account */
  delete(): void {
    if (this.deleteLoading) {
      return;
    }

    this.deleteLoading = true;

    this.authApiService
      .deleteAccount()
      .pipe(takeUntil(this.cancelDeleteAccountEmitter))
      .pipe(finalize(() => (this.deleteLoading = false)))
      .subscribe({
        next: (deletedAccount) => {
          this.signedProfile = null;
          this.accessToken = '';
          this.accountDeleted.emit(deletedAccount);
        },
        error: (err: HttpErrorResponse) => this.deleteFailed.emit(err),
      });
  }

  private onLogin(profile: Profile): void {
    this.signedProfile = profile;
    this.accessToken = profile.accessToken;
    this.signChecked = true;
    this.loggedIn.emit(profile);
  }

  private onLoginFailed(err: HttpErrorResponse): void {
    this.signedProfile = null;
    this.accessToken = '';
    this.signChecked = true;
    this.loginFailed.emit(err);
  }

  cancelStart(): void {
    this.cancelStartEmitter.emit();
  }

  cancelLogin(): void {
    this.cancelLoginEmitter.emit();
  }

  cancelLogout(): void {
    this.cancelLogoutEmitter.emit();
  }
}
