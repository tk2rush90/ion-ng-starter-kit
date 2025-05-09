import { TestBed } from '@angular/core/testing';

import { MetaRobotsService } from './meta-robots.service';

describe('MetaRobotsService', () => {
  let service: MetaRobotsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetaRobotsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
