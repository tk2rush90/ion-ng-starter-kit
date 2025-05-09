import { TestBed } from '@angular/core/testing';

import { MetaLocaleService } from './meta-locale.service';

describe('MetaLocaleService', () => {
  let service: MetaLocaleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetaLocaleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
