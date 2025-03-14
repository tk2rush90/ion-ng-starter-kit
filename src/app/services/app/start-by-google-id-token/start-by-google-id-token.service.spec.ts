import { TestBed } from '@angular/core/testing';

import { StartByGoogleIdTokenService } from './start-by-google-id-token.service';

describe('StartByGoogleIdTokenService', () => {
  let service: StartByGoogleIdTokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StartByGoogleIdTokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
