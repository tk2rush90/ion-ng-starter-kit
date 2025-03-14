import { TestBed } from '@angular/core/testing';

import { StartByGoogleAccessTokenService } from './start-by-google-access-token.service';

describe('StartByGoogleAccessTokenService', () => {
  let service: StartByGoogleAccessTokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StartByGoogleAccessTokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
