import { Injectable } from '@angular/core';
import { CrudService } from '../crud/crud.service';
import { AuthApiService } from '../../api/auth-api/auth-api.service';

@Injectable()
export class LogoutService extends CrudService<void> {
  constructor(private readonly authApiService: AuthApiService) {
    super();
  }

  override create() {
    this.handleCreateObservable(this.authApiService.logout());
  }
}
