import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MemberDto } from '../../../dto/member-dto';
import { CookieService } from '../cookie/cookie.service';
import { MEMBER_COOKIE } from '../../../constants/cookie-names';

@Injectable({
  providedIn: 'root',
})
export class SignedMemberService {
  member$ = new BehaviorSubject<MemberDto | null>(null);

  constructor(private readonly cookieService: CookieService) {}

  get member(): MemberDto | null {
    return this.member$.value;
  }

  set member(value: MemberDto | null) {
    this.member$.next(value);
  }

  loadFromCookie(): void {
    const memberString = this.cookieService.get(MEMBER_COOKIE);

    if (memberString) {
      this.member = JSON.parse(memberString) as MemberDto;
    }
  }
}
