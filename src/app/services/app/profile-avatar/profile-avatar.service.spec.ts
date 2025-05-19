import { TestBed } from '@angular/core/testing';

import { ProfileAvatarService } from './profile-avatar.service';

describe('ProfileAvatarService', () => {
  let service: ProfileAvatarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileAvatarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
