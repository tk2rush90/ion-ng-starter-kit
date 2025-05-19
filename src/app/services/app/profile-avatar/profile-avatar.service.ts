import { Injectable } from '@angular/core';
import { DataService } from '../data/data-service';

/** 로그인 한 사용자의 프로필 실루엣 관리 서비스. 로그인 한 동안 유지 */
@Injectable({
  providedIn: 'root',
})
export class ProfileAvatarService extends DataService<string> {
  constructor() {
    super();
  }
}
