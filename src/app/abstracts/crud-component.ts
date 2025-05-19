import { Component } from '@angular/core';
import { CrudService } from '../services/app/crud/crud.service';
import { AngularPlatform } from '../utils/platform.utils';

@Component({
  template: '',
  selector: 'app-crud',
})
export abstract class CrudComponent<S extends CrudService<D>, D> {
  abstract get service(): S;

  get data(): D | null {
    return this.service.data;
  }

  get fetchLoading(): boolean {
    return this.service.fetchLoading || AngularPlatform.isServer;
  }
}
