import { TestBed } from '@angular/core/testing';

import { AppProfileService } from './app-profile.service';

describe('AppProfileService', () => {
  let service: AppProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
