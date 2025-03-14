import { Injectable } from '@angular/core';
import { CrudService } from '../crud/crud.service';
import { MemberDto } from '../../../dto/member-dto';
import { AuthApiService } from '../../api/auth-api/auth-api.service';
import { AccessTokenRequestDto } from '../../../dto/access-token-request-dto';

@Injectable()
export class StartByGoogleAccessTokenService extends CrudService<MemberDto> {
  constructor(private readonly authApiService: AuthApiService) {
    super();
  }

  override create(body: AccessTokenRequestDto) {
    this.handleCreateObservable(
      this.authApiService.startByGoogleAccessToken(body),
    );
  }
}
