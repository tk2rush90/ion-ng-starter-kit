import { Component } from '@angular/core';
import { DataService } from '../services/app/data/data-service';

@Component({
  template: '',
  selector: 'app-data',
})
export abstract class DataComponent<S extends DataService<D>, D> {
  abstract get service(): S;

  get data(): D | null {
    return this.service.data;
  }
}
