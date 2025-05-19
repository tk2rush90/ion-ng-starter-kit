import { Component } from '@angular/core';
import { PagingListService } from '../services/app/paging-list/paging-list.service';
import { AngularPlatform } from '../utils/platform.utils';

@Component({
  template: '',
  selector: 'app-paging-list-data',
})
export abstract class PagingListDataComponent<
  S extends PagingListService<D>,
  D extends { id: string },
> {
  abstract get service(): S;

  get data(): D[] {
    return this.service.data;
  }

  set data(data: D[]) {
    this.service.data = data;
  }

  get nextCursor(): string | undefined {
    return this.service.nextCursor;
  }

  get fetchLoading(): boolean {
    return this.service.fetchLoading || AngularPlatform.isServer;
  }

  get onceFetched(): boolean {
    return this.service.onceFetched;
  }

  get isEmpty(): boolean {
    return this.data.length === 0;
  }

  fetch(): void {
    this.service.fetch();
  }
}
