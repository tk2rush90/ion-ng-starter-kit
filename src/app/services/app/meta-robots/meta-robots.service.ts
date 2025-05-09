import { Injectable } from '@angular/core';
import { MetaService } from '../meta/meta.service';

@Injectable({
  providedIn: 'root',
})
export class MetaRobotsService extends MetaService {
  constructor() {
    super();
  }

  setRobots(value: string): void {
    const robots = this.get('name', 'robots');

    robots.setAttribute('content', value);
  }
}
