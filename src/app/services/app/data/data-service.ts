import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export abstract class DataService<D> {
  data$ = new BehaviorSubject<D | null>(null);

  get data(): D | null {
    return this.data$.value;
  }

  set data(value: D | null) {
    this.data$.next(value);
  }
}
