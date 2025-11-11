import { TestBed } from '@angular/core/testing';

import { AngularPlatformService } from './angular-platform.service';

describe('AngularPlatformService', () => {
  let service: AngularPlatformService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AngularPlatformService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
