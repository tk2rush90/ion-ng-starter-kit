import { TestBed } from '@angular/core/testing';

import { SignedMemberService } from './signed-member.service';

describe('SignedMemberService', () => {
  let service: SignedMemberService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignedMemberService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
