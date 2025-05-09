import { TestBed } from '@angular/core/testing';

import { HrefLangService } from './href-lang.service';

describe('HrefLangService', () => {
  let service: HrefLangService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HrefLangService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
