import { Injectable } from '@angular/core';
import { DataService } from '../data/data-service';
import { AppProfileDto } from '../../../dto/app-profile-dto';

/** 로그인 한 사용자의 프로필 보유 서비스 */
@Injectable({
  providedIn: 'root',
})
export class AppProfileService extends DataService<AppProfileDto> {
  constructor() {
    super();
  }
}
