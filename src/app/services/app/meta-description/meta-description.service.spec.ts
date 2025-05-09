import { TestBed } from '@angular/core/testing';

import { MetaDescriptionService } from './meta-description.service';

describe('DescriptionService', () => {
  let service: MetaDescriptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetaDescriptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
