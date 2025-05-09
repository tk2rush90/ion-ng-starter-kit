import { TestBed } from '@angular/core/testing';

import { MetaImageService } from './meta-image.service';

describe('MetaImageService', () => {
  let service: MetaImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetaImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
