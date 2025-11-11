import { TestBed } from '@angular/core/testing';

import { IonicPlatformService } from './ionic-platform.service';

describe('IonicPlatformService', () => {
  let service: IonicPlatformService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IonicPlatformService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
