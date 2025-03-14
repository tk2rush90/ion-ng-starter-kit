import { Injectable } from '@angular/core';
import { CrudService } from '../crud/crud.service';
import { AuthApiService } from '../../api/auth-api/auth-api.service';
import { IdTokenRequestDto } from '../../../dto/id-token-request-dto';
import { MemberDto } from '../../../dto/member-dto';

@Injectable()
export class StartByGoogleIdTokenService extends CrudService<MemberDto> {
  constructor(private readonly authApiService: AuthApiService) {
    super();
  }

  override create(body: IdTokenRequestDto) {
    this.handleCreateObservable(this.authApiService.startByGoogleIdToken(body));
  }
}
