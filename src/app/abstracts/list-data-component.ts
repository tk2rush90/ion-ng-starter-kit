import { Component } from '@angular/core';
import { AngularPlatform } from '../utils/platform.utils';
import { ListCrudService } from '../services/app/list-crud/list-crud.service';

@Component({
  template: '',
  selector: 'app-list-data',
})
export abstract class ListDataComponent<
  S extends ListCrudService<D>,
  D extends { id: string },
> {
  abstract get service(): S;

  get data(): D[] {
    return this.service.data || [];
  }

  set data(data: D[]) {
    this.service.data = data;
  }

  get isEmpty(): boolean {
    return this.data.length === 0;
  }

  get fetchLoading(): boolean {
    return this.service.fetchLoading || AngularPlatform.isServer;
  }

  get onceFetched(): boolean {
    return this.service.onceFetched;
  }
}
