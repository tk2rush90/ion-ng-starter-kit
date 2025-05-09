import { TestBed } from '@angular/core/testing';

import { MetaTitleService } from './meta-title.service';

describe('MetaTitleService', () => {
  let service: MetaTitleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetaTitleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
